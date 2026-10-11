/**
 * Reading-club roadmap logic.
 *
 * Invariants (covered by tests/roadmap.test.js):
 *   - Display order is the order of entries in roadmap.js. Nothing here sorts
 *     the roadmap, and no function reads an array index as meaning.
 *   - A paper's article link only resolves to a post the caller passes in as
 *     public, so drafts are never linked.
 */
import { isIsoDate, isTime } from "./dates.js";
import { SLUG_PATTERN } from "./posts.js";

export const PAPER_STATUSES = ["backlog", "scheduled", "discussed", "published"];

const HTTP_URL = /^https?:\/\/\S+$/i;
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const isStringList = (v) => Array.isArray(v) && v.every(isNonEmptyString);

/**
 * Structural validation of the roadmap file.
 * Errors: duplicate IDs and malformed fields (the build fails).
 * Warnings: likely mistakes that still render fine.
 *
 * @param {unknown} papers
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateRoadmap(papers) {
  const errors = [];
  const warnings = [];
  if (!Array.isArray(papers)) {
    return { errors: ["roadmap: `papers` must be an array"], warnings };
  }

  const seen = new Map();
  papers.forEach((paper, i) => {
    const where = `roadmap entry #${i + 1}${paper?.id ? ` (${paper.id})` : ""}:`;
    if (paper === null || typeof paper !== "object") {
      errors.push(`${where} must be an object`);
      return;
    }

    if (!isNonEmptyString(paper.id) || !SLUG_PATTERN.test(paper.id)) {
      errors.push(`${where} "id" is required and must look like "u-net" (lowercase, digits, hyphens)`);
    } else if (seen.has(paper.id)) {
      errors.push(`${where} duplicate id "${paper.id}" (also entry #${seen.get(paper.id) + 1})`);
    } else {
      seen.set(paper.id, i);
    }

    if (!isNonEmptyString(paper.title)) errors.push(`${where} "title" is required`);
    if (!Number.isInteger(paper.year) || paper.year < 1900 || paper.year > 2100) {
      errors.push(`${where} "year" must be a four-digit number`);
    }
    if (!(typeof paper.url === "string" && HTTP_URL.test(paper.url))) {
      errors.push(`${where} "url" must be the original paper's http(s) link`);
    }
    if (!PAPER_STATUSES.includes(paper.status)) {
      errors.push(`${where} "status" must be one of ${PAPER_STATUSES.join(", ")}`);
    }
    if (!isStringList(paper.topics ?? [])) errors.push(`${where} "topics" must be a list of strings`);
    for (const field of ["authors", "prerequisites"]) {
      if (paper[field] != null && !isStringList(paper[field])) {
        errors.push(`${where} "${field}" must be a list of strings when present`);
      }
    }
    for (const field of ["question", "concept", "bioConnection", "exercise", "venue"]) {
      if (paper[field] != null && !isNonEmptyString(paper[field])) {
        errors.push(`${where} "${field}" must be a non-empty string when present`);
      }
    }
    for (const field of ["codeUrl", "discussionUrl"]) {
      if (paper[field] != null && !(typeof paper[field] === "string" && HTTP_URL.test(paper[field]))) {
        errors.push(`${where} "${field}" must be an http(s) URL when present`);
      }
    }
    if (paper.sessionDate != null && !isIsoDate(paper.sessionDate)) {
      errors.push(`${where} "sessionDate" must be YYYY-MM-DD`);
    }
    if (paper.sessionTime != null) {
      if (!isTime(paper.sessionTime)) errors.push(`${where} "sessionTime" must be 24-hour HH:MM, e.g. "19:00"`);
      if (paper.sessionDate == null) errors.push(`${where} "sessionTime" needs a "sessionDate"`);
    }
    if (paper.articleSlug != null && !(isNonEmptyString(paper.articleSlug) && SLUG_PATTERN.test(paper.articleSlug))) {
      errors.push(`${where} "articleSlug" must be an article slug like "u-net-notes"`);
    }

    if (paper.status === "scheduled" && !paper.sessionDate) {
      warnings.push(`${where} status is "scheduled" but no sessionDate is set`);
    }
    if (!paper.question) warnings.push(`${where} consider adding a "question" (the main learning question)`);
  });

  return { errors, warnings };
}

/**
 * Warnings about links between the roadmap and articles. Never errors: a
 * removed paper or an unpublished article must not fail an otherwise valid build.
 *
 * @param {object[]} papers
 * @param {object[]} allPosts     every post, drafts included
 * @param {(post: object) => boolean} isPublic
 */
export function crossCheckRoadmap(papers, allPosts, isPublic) {
  const warnings = [];
  const bySlug = new Map(allPosts.map((p) => [p.slug, p]));
  const paperIds = new Set(papers.map((p) => p.id));

  for (const paper of papers) {
    if (paper.articleSlug) {
      const post = bySlug.get(paper.articleSlug);
      if (!post) {
        warnings.push(`roadmap "${paper.id}": articleSlug "${paper.articleSlug}" does not match any article`);
      } else if (!isPublic(post)) {
        warnings.push(`roadmap "${paper.id}": article "${paper.articleSlug}" is not published yet, so no link is shown`);
      }
    }
    if (paper.status === "published" && !resolvePaperArticle(paper, allPosts.filter(isPublic))) {
      warnings.push(`roadmap "${paper.id}": status is "published" but there is no published article to link`);
    }
  }

  for (const post of allPosts) {
    if (post.paperId && !paperIds.has(post.paperId)) {
      warnings.push(
        `article "${post.slug}": paperId "${post.paperId}" is not in the roadmap; the article's own paper fields are used`,
      );
    }
  }
  return warnings;
}

/**
 * The article for a paper: its explicit `articleSlug` if that post is public,
 * otherwise the newest public post that names this paper via `paperId`.
 * @param {object} paper
 * @param {object[]} publicPosts  already filtered by isPublished
 */
export function resolvePaperArticle(paper, publicPosts) {
  if (paper.articleSlug) {
    const explicit = publicPosts.find((p) => p.slug === paper.articleSlug);
    if (explicit) return explicit;
  }
  const linked = publicPosts.filter((p) => p.paperId === paper.id);
  if (!linked.length) return null;
  return linked.reduce((newest, p) => (p.date > newest.date ? p : newest));
}

/**
 * Roadmap entries in source order, each with its resolved public article.
 * Returns new objects; the source array is never mutated or reordered.
 */
export function buildRoadmap(papers, publicPosts) {
  return papers.map((paper) => ({ ...paper, article: resolvePaperArticle(paper, publicPosts) }));
}

/**
 * Paper details for an article. Front matter wins for title and URL (so the
 * article is self-contained); the roadmap entry, when it still exists, adds
 * authors and year. Returns null when there is nothing to show.
 * @param {object} post
 * @param {object[]} papers
 */
export function resolvePaperForPost(post, papers) {
  const entry = post.paperId ? papers.find((p) => p.id === post.paperId) : undefined;
  const title = post.paperTitle ?? entry?.title ?? null;
  const url = post.paperUrl ?? entry?.url ?? null;
  if (!title && !url) return null;
  return {
    id: post.paperId ?? null,
    title: title ?? url,
    url,
    authors: post.paperAuthors ?? (entry?.authors?.length ? entry.authors.join(", ") : null),
    year: entry?.year ?? null,
    inRoadmap: Boolean(entry),
  };
}
