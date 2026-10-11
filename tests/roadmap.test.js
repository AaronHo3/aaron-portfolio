import { describe, expect, it } from "vitest";
import {
  buildRoadmap,
  crossCheckRoadmap,
  resolvePaperForPost,
  validateRoadmap,
} from "../src/lib/content/roadmap.js";
import { isPublished } from "../src/lib/content/posts.js";
import { papers as realRoadmap } from "../src/content/reading-club/roadmap.js";

const TODAY = "2026-10-10";

const paper = (id, extra = {}) => ({
  id,
  title: `Paper ${id}`,
  year: 2020,
  url: `https://example.org/${id}`,
  status: "backlog",
  topics: [],
  question: "Why?",
  ...extra,
});

const post = (slug, extra = {}) => ({
  slug,
  title: slug,
  description: "d",
  date: "2026-09-01",
  draft: false,
  tags: [],
  series: null,
  paperId: null,
  paperTitle: null,
  paperUrl: null,
  ...extra,
});

describe("the real roadmap file", () => {
  it("has no validation errors", () => {
    expect(validateRoadmap(realRoadmap).errors).toEqual([]);
  });

  it("uses source order and keeps each session date on its own entry", () => {
    for (const p of realRoadmap) {
      if (p.sessionDate) expect(p.status).not.toBe("backlog");
    }
  });
});

describe("roadmap order", () => {
  it("follows source order, not title, year, id, status, or date", () => {
    const papers = [
      paper("zeta", { year: 1999, status: "published" }),
      paper("alpha", { year: 2024, sessionDate: "2026-12-06" }),
      paper("mid", { year: 2010, sessionDate: "2026-10-18" }),
    ];
    expect(buildRoadmap(papers, []).map((p) => p.id)).toEqual(["zeta", "alpha", "mid"]);
  });

  it("reflects added and removed entries", () => {
    const base = [paper("a"), paper("b"), paper("c")];
    const added = [base[0], paper("new"), ...base.slice(1)];
    const removed = base.filter((p) => p.id !== "b");
    expect(buildRoadmap(added, []).map((p) => p.id)).toEqual(["a", "new", "b", "c"]);
    expect(buildRoadmap(removed, []).map((p) => p.id)).toEqual(["a", "c"]);
  });

  it("does not mutate or reorder the source array", () => {
    const papers = [paper("b"), paper("a")];
    const snapshot = structuredClone(papers);
    buildRoadmap(papers, [post("x", { paperId: "a" })]);
    expect(papers).toEqual(snapshot);
  });
});

describe("reordering preserves relationships", () => {
  it("keeps id, date, status, and article link when an entry moves", () => {
    const published = [post("unet-notes", { paperId: "u-net" })];
    const original = [
      paper("u-net", { status: "published", sessionDate: "2026-10-04", articleSlug: "unet-notes" }),
      paper("vae", { status: "scheduled", sessionDate: "2026-10-18" }),
    ];
    const moved = [original[1], original[0]];

    const byId = (list) => Object.fromEntries(buildRoadmap(list, published).map((p) => [p.id, p]));
    const before = byId(original);
    const after = byId(moved);
    for (const id of ["u-net", "vae"]) {
      expect(after[id].status).toBe(before[id].status);
      expect(after[id].sessionDate).toBe(before[id].sessionDate);
      expect(after[id].article?.slug).toBe(before[id].article?.slug);
    }
    expect(after["u-net"].article.slug).toBe("unet-notes");
  });
});

describe("article links", () => {
  it("never links to an unpublished article, even when the paper is marked published", () => {
    const all = [post("draft-notes", { draft: true, paperId: "u-net" })];
    const publicPosts = all.filter((p) => isPublished(p, TODAY));
    const [entry] = buildRoadmap([paper("u-net", { status: "published", articleSlug: "draft-notes" })], publicPosts);
    expect(entry.article).toBeNull();
  });

  it("falls back to the newest public post naming the paper via paperId", () => {
    const publicPosts = [
      post("older", { paperId: "vae", date: "2026-09-01" }),
      post("newer", { paperId: "vae", date: "2026-09-20" }),
    ];
    expect(buildRoadmap([paper("vae")], publicPosts)[0].article.slug).toBe("newer");
  });

  it("keeps status independent: a discussed paper without an article has no link", () => {
    expect(buildRoadmap([paper("x", { status: "discussed" })], [])[0].article).toBeNull();
  });
});

describe("removing a paper", () => {
  it("leaves the article's own paper metadata intact", () => {
    const article = post("orphan", {
      paperId: "gone",
      paperTitle: "Gone Paper",
      paperUrl: "https://example.org/gone",
    });
    expect(resolvePaperForPost(article, [paper("other")])).toMatchObject({
      title: "Gone Paper",
      url: "https://example.org/gone",
      inRoadmap: false,
    });
  });

  it("reports a warning, not an error", () => {
    const warnings = crossCheckRoadmap([paper("other")], [post("orphan", { paperId: "gone" })], () => true);
    expect(warnings.join("\n")).toMatch(/paperId "gone" is not in the roadmap/);
  });

  it("uses roadmap details when the entry still exists", () => {
    const entry = paper("vae", { authors: ["A", "B"], year: 2013 });
    expect(resolvePaperForPost(post("p", { paperId: "vae" }), [entry])).toMatchObject({
      title: "Paper vae",
      authors: "A, B",
      year: 2013,
      inRoadmap: true,
    });
  });
});

describe("validation", () => {
  it("rejects duplicate ids", () => {
    const { errors } = validateRoadmap([paper("dup"), paper("ok"), paper("dup")]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/duplicate id "dup"/);
  });

  it("rejects malformed required fields", () => {
    const { errors } = validateRoadmap([
      { id: "Bad Id", title: "", year: "2020", url: "arxiv.org/x", status: "maybe" },
    ]);
    const text = errors.join("\n");
    for (const field of ["id", "title", "year", "url", "status"]) expect(text).toMatch(new RegExp(`"${field}"`));
  });

  it("rejects bad session dates and orphan times", () => {
    const { errors } = validateRoadmap([
      paper("a", { sessionDate: "2026-02-30" }),
      paper("b", { sessionTime: "7pm" }),
    ]);
    expect(errors.join("\n")).toMatch(/sessionDate/);
    expect(errors.join("\n")).toMatch(/sessionTime/);
  });

  it("warns when a scheduled paper has no date", () => {
    expect(validateRoadmap([paper("s", { status: "scheduled" })]).warnings.join()).toMatch(/no sessionDate/);
  });
});
