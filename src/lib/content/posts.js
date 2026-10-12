/**
 * Article metadata: normalization, validation, and the single publication
 * filter shared by every public surface (routes, index, series archive,
 * related posts, RSS, sitemap).
 */
import { isIsoDate, normalizeDate } from "./dates.js";
import { READING_CLUB_SERIES, series as knownSeries } from "../../content/site.config.js";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HTTP_URL = /^https?:\/\/\S+$/i;

const OPTIONAL_URL_FIELDS = ["paperUrl", "codeUrl", "discussionUrl"];
const OPTIONAL_STRING_FIELDS = ["series", "paperId", "paperTitle", "paperAuthors"];

/** @param {unknown} v */
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

/**
 * Validate raw front matter and return a normalized post.
 *
 * Errors mean the file cannot be published as written (the build fails).
 * Warnings are authoring hints and never fail the build.
 *
 * @param {Record<string, unknown>} fm  parsed front matter
 * @param {{ fileSlug: string, file: string }} source
 * @returns {{ post: object | null, errors: string[], warnings: string[] }}
 */
export function normalizePost(fm, { fileSlug, file }) {
  const errors = [];
  const warnings = [];
  const where = `${file}:`;

  if (fm === null || typeof fm !== "object" || Array.isArray(fm)) {
    return { post: null, errors: [`${where} missing or invalid front matter block`], warnings };
  }

  const slug = fm.slug ?? fileSlug;
  if (!isNonEmptyString(slug) || !SLUG_PATTERN.test(slug)) {
    errors.push(`${where} slug "${slug}" must be lowercase letters, digits, and single hyphens`);
  }
  for (const field of ["title", "description"]) {
    if (!isNonEmptyString(fm[field])) errors.push(`${where} "${field}" is required`);
  }

  const date = normalizeDate(fm.date);
  if (!isIsoDate(date)) errors.push(`${where} "date" must be YYYY-MM-DD (got ${JSON.stringify(fm.date)})`);

  const updated = fm.updated == null ? null : normalizeDate(fm.updated);
  if (updated !== null && !isIsoDate(updated)) {
    errors.push(`${where} "updated" must be YYYY-MM-DD when present`);
  } else if (updated && isIsoDate(date) && updated < date) {
    warnings.push(`${where} "updated" (${updated}) is before "date" (${date})`);
  }

  if (fm.draft != null && typeof fm.draft !== "boolean") {
    errors.push(`${where} "draft" must be true or false`);
  }

  const tags = fm.tags ?? [];
  if (!Array.isArray(tags) || !tags.every(isNonEmptyString)) {
    errors.push(`${where} "tags" must be a list of strings, e.g. [single-cell, vae]`);
  }

  for (const field of OPTIONAL_STRING_FIELDS) {
    if (fm[field] != null && !isNonEmptyString(fm[field])) {
      errors.push(`${where} "${field}" must be a non-empty string when present`);
    }
  }
  for (const field of OPTIONAL_URL_FIELDS) {
    if (fm[field] != null && !(typeof fm[field] === "string" && HTTP_URL.test(fm[field]))) {
      errors.push(`${where} "${field}" must be an http(s) URL when present`);
    }
  }

  if (fm.series && !knownSeries[fm.series]) {
    warnings.push(`${where} unknown series "${fm.series}" (known: ${Object.keys(knownSeries).join(", ")})`);
  }
  if (fm.series === READING_CLUB_SERIES && (!fm.paperTitle || !fm.paperUrl)) {
    warnings.push(
      `${where} reading-club articles should set paperTitle and paperUrl so the article stays self-contained if the paper leaves the roadmap`,
    );
  }

  if (errors.length) return { post: null, errors, warnings };

  const post = {
    slug,
    title: fm.title.trim(),
    description: fm.description.trim(),
    date,
    updated,
    draft: fm.draft === true,
    tags: tags.map((t) => t.trim()),
    series: fm.series ?? null,
    paperId: fm.paperId ?? null,
    paperTitle: fm.paperTitle ?? null,
    paperAuthors: fm.paperAuthors ?? null,
    paperUrl: fm.paperUrl ?? null,
    codeUrl: fm.codeUrl ?? null,
    discussionUrl: fm.discussionUrl ?? null,
  };
  return { post, errors, warnings };
}

/**
 * THE publication filter. A post is public when it is not a draft and its
 * date is on or before `today` (both "YYYY-MM-DD", so string compare works).
 * @param {{ draft: boolean, date: string }} post
 * @param {string} today
 */
export function isPublished(post, today) {
  return post.draft !== true && post.date <= today;
}

/**
 * Lifecycle label used for local-preview badges.
 * @returns {"draft" | "scheduled" | "published"}
 */
export function publicationState(post, today) {
  if (post.draft) return "draft";
  if (post.date > today) return "scheduled";
  return "published";
}

/** Newest first; ties broken by title for a stable order. */
export function sortNewestFirst(posts) {
  return [...posts].sort((a, b) =>
    a.date === b.date ? a.title.localeCompare(b.title) : a.date < b.date ? 1 : -1,
  );
}

/**
 * @param {object[]} posts
 * @param {{ today: string, includeUnpublished?: boolean }} opts
 */
export function selectPosts(posts, { today, includeUnpublished = false }) {
  const chosen = includeUnpublished ? posts : posts.filter((p) => isPublished(p, today));
  return sortNewestFirst(chosen);
}

/**
 * Up to `limit` other posts, scored by shared series (strong) and shared tags.
 * Callers pass an already-filtered list, so drafts never appear as related.
 */
export function relatedPosts(post, candidates, limit = 3) {
  const tagSet = new Set(post.tags);
  return sortNewestFirst(candidates)
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        (post.series && p.series === post.series ? 3 : 0) +
        p.tags.filter((t) => tagSet.has(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Tags across posts, most used first, then alphabetical. */
export function collectTags(posts) {
  const counts = new Map();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/**
 * Rough reading time at ~220 words per minute, minimum one minute.
 * Code blocks, inline SVG diagrams, and HTML tag markup are not prose, so
 * they are dropped before counting (figure captions still count).
 */
export function readingMinutes(markdown) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
