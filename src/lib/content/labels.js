/** Display labels for series IDs, topic tags, and paper statuses. */
import { series as knownSeries, topicLabels } from "../../content/site.config.js";

/** @param {string | null} seriesId @returns {{ label: string, path: string | null } | null} */
export function seriesInfo(seriesId) {
  if (!seriesId) return null;
  return knownSeries[seriesId] ?? { label: seriesId, path: null };
}

/** @param {string} tag */
export function topicLabel(tag) {
  return topicLabels[tag] ?? tag;
}

export const STATUS_LABELS = {
  backlog: "Backlog",
  scheduled: "Scheduled",
  discussed: "Discussed",
  published: "Published",
};

/** "A, B, C, D" -> "A et al." for long author lists. */
export function shortAuthors(authors, max = 3) {
  if (!authors?.length) return "";
  return authors.length > max ? `${authors[0]} et al.` : authors.join(", ");
}
