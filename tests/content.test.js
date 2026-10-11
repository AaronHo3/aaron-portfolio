import { existsSync } from "node:fs";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { blogPlugin, indexModuleSource, loadBlogContent, splitFrontMatter } from "../build/blog-plugin.js";
import { buildRss, buildSitemap } from "../build/feeds.js";
import { renderMarkdown } from "../build/markdown.js";
import { isPublished, normalizePost, relatedPosts, selectPosts } from "../src/lib/content/posts.js";
import { formatDate, todayIn } from "../src/lib/content/dates.js";
import { site } from "../src/content/site.config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(here, "fixtures/blog");
const TODAY = "2026-10-10";
const SECRETS = ["SECRET DRAFT", "secret-draft", "FUTURE POST", "future-post", "FUTURE BODY"];

const production = () => loadBlogContent({ contentDir, today: TODAY, includeUnpublished: false });
const preview = () => loadBlogContent({ contentDir, today: TODAY, includeUnpublished: true });

function expectNoSecrets(text) {
  for (const s of SECRETS) expect(text).not.toContain(s);
}

describe("publication filter", () => {
  it("excludes drafts and future-dated posts", () => {
    expect(isPublished({ draft: true, date: "2026-01-01" }, TODAY)).toBe(false);
    expect(isPublished({ draft: false, date: "2026-10-11" }, TODAY)).toBe(false);
    expect(isPublished({ draft: false, date: TODAY }, TODAY)).toBe(true);
  });

  it("orders newest first", () => {
    const posts = [
      { slug: "a", title: "a", date: "2026-01-01", draft: false },
      { slug: "b", title: "b", date: "2026-03-01", draft: false },
    ];
    expect(selectPosts(posts, { today: TODAY }).map((p) => p.slug)).toEqual(["b", "a"]);
  });
});

describe("production content (vite build)", () => {
  it("keeps drafts and future posts out of every public surface", async () => {
    const { visible, errors } = await production();
    expect(errors).toEqual([]);
    expect(visible.map((p) => p.slug).sort()).toEqual(["club-post", "general-post", "orphan-post"]);

    const index = indexModuleSource(visible, false);
    expectNoSecrets(index);
    expectNoSecrets(buildRss(visible, site));
    expectNoSecrets(buildSitemap(visible, site));
    for (const p of visible) expectNoSecrets(JSON.stringify(relatedPosts(p, visible)));
  });

  it("does not generate a route module for a draft", async () => {
    const plugin = blogPlugin({ contentDir, today: TODAY });
    plugin.configResolved({ root: path.resolve(here, ".."), command: "build", logger: console });
    const draftModule = await plugin.load("\0virtual:blog-post/secret-draft");
    expect(draftModule).toBe("export default null;");
    const index = await plugin.load("\0virtual:blog");
    expect(index).not.toContain("secret-draft");
    expect(index).toContain("previewMode = false");
  });

  it("deletes copied public/blog/<slug>/ assets of unpublished posts after a build", async () => {
    const outDir = await mkdtemp(path.join(os.tmpdir(), "blog-dist-"));
    for (const slug of ["secret-draft", "future-post", "general-post", "shared"]) {
      await mkdir(path.join(outDir, "blog", slug), { recursive: true });
      await writeFile(path.join(outDir, "blog", slug, "fig.svg"), "<svg/>");
    }
    const plugin = blogPlugin({ contentDir, today: TODAY });
    plugin.configResolved({ root: path.resolve(here, ".."), command: "build", logger: console, build: { outDir } });
    await plugin.closeBundle();
    expect(existsSync(path.join(outDir, "blog/secret-draft"))).toBe(false);
    expect(existsSync(path.join(outDir, "blog/future-post"))).toBe(false);
    expect(existsSync(path.join(outDir, "blog/general-post/fig.svg"))).toBe(true);
    expect(existsSync(path.join(outDir, "blog/shared/fig.svg"))).toBe(true);
  });

  it("still renders an article whose paper was removed from the roadmap", async () => {
    const { visible } = await production();
    const orphan = visible.find((p) => p.slug === "orphan-post");
    expect(orphan.paperTitle).toBe("A Removed Paper");
    expect(orphan.paperUrl).toBe("https://example.org/removed");
    expect(orphan.html).toContain("Still renders.");
  });

  it("ignores underscore-prefixed files", async () => {
    const { all } = await preview();
    expect(all.some((p) => p.slug.includes("ignored"))).toBe(false);
  });
});

describe("local preview content (vite dev)", () => {
  it("includes drafts and scheduled posts with a state label", async () => {
    const { visible } = await preview();
    const state = Object.fromEntries(visible.map((p) => [p.slug, p.state]));
    expect(state["secret-draft"]).toBe("draft");
    expect(state["future-post"]).toBe("scheduled");
    expect(state["general-post"]).toBe("published");
    expect(indexModuleSource(visible, true)).toContain("previewMode = true");
  });
});

describe("front matter", () => {
  it("lets general articles omit every paper field", () => {
    const { post, errors } = normalizePost(
      { title: "T", description: "D", date: "2026-01-01" },
      { fileSlug: "t", file: "t.md" },
    );
    expect(errors).toEqual([]);
    expect(post).toMatchObject({ slug: "t", draft: false, tags: [], series: null, paperId: null });
  });

  it("reports malformed required fields", () => {
    const { post, errors } = normalizePost(
      { title: "", date: "Oct 1", draft: "yes", tags: "ml", paperUrl: "nope" },
      { fileSlug: "Bad Slug", file: "x.md" },
    );
    expect(post).toBeNull();
    const text = errors.join("\n");
    for (const f of ["slug", "title", "description", "date", "draft", "tags", "paperUrl"]) expect(text).toContain(f);
  });

  it("accepts YAML Date objects without shifting the day", () => {
    const { post } = normalizePost(
      { title: "T", description: "D", date: new Date("2026-10-18T00:00:00Z") },
      { fileSlug: "t", file: "t.md" },
    );
    expect(post.date).toBe("2026-10-18");
  });

  it("errors on a missing front matter block", () => {
    expect(splitFrontMatter("# no front matter", "x.md").error).toMatch(/front matter/);
  });
});

describe("dates", () => {
  it("formats date-only strings without timezone drift", () => {
    expect(formatDate("2026-10-18")).toBe("October 18, 2026");
  });

  it("computes today in the configured zone", () => {
    const lateUtc = new Date("2026-10-11T03:00:00Z"); // still Oct 10 in Los Angeles
    expect(todayIn("America/Los_Angeles", lateUtc)).toBe("2026-10-10");
  });
});

describe("markdown rendering", () => {
  it("rewrites same-page anchors for hash routing and counts stray h1s", () => {
    const { html, h1Count } = renderMarkdown("# Extra title\n\n[jump](#intro)", { slug: "my-post" });
    expect(html).toContain('href="/#/blog/my-post#intro"');
    expect(h1Count).toBe(1);
  });

  it("handles headings, code, tables, math, figures, and links", () => {
    const { html, toc } = renderMarkdown(
      [
        "## Intro",
        "## Intro",
        "### Detail",
        "```python\nprint('hi')\n```",
        "| a | b |\n| - | - |\n| 1 | 2 |",
        "$$\nx^2\n$$",
        '![alt text](/blog/x/fig.png "A caption")',
        "[club](/reading-club) [ext](https://example.org) [file](/blog/x/data.csv)",
      ].join("\n\n"),
    );
    expect(toc.map((h) => h.id)).toEqual(["intro", "intro-2", "detail"]);
    expect(html).toContain('<pre tabindex="0"');
    expect(html).toContain('class="hljs language-python"');
    expect(html).toContain('<div class="tableWrap"');
    expect(html).toContain('class="mathBlock"');
    expect(html).toContain("katex");
    expect(html).toMatch(/<figure><img src="\/blog\/x\/fig.png" alt="alt text"[^>]*><figcaption>A caption<\/figcaption><\/figure>/);
    expect(html).not.toMatch(/<p><figure>/);
    expect(html).toContain('href="/#/reading-club"');
    expect(html).toContain('href="https://example.org" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('href="/blog/x/data.csv"');
  });
});
