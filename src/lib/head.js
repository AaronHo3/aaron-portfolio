/**
 * Per-page <title>, description, canonical, and social tags for the SPA.
 * Tags added here are marked and removed when the page unmounts, and the
 * original document title is restored, so other pages are unaffected.
 *
 * Note: with hash routing, crawlers that do not run JavaScript only see the
 * static index.html. See docs/blog-implementation-progress.md.
 */
import { onBeforeUnmount, watchEffect } from "vue";

const MARK = "data-page-head";

function clearManaged() {
  for (const el of document.head.querySelectorAll(`[${MARK}]`)) el.remove();
}

function addTag(tag, attrs) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.setAttribute(MARK, "");
  document.head.appendChild(el);
}

/**
 * @typedef {{ title: string, description?: string, canonical?: string,
 *   type?: "website" | "article", publishedTime?: string, modifiedTime?: string,
 *   tags?: string[], noindex?: boolean }} PageHead
 * @param {() => PageHead | null} getHead reactive getter
 */
export function usePageHead(getHead) {
  const originalTitle = document.title;

  const stop = watchEffect(() => {
    const head = getHead();
    clearManaged();
    if (!head) return;
    document.title = head.title;
    const meta = (key, content, attr = "name") => content && addTag("meta", { [attr]: key, content });
    meta("description", head.description);
    if (head.canonical) addTag("link", { rel: "canonical", href: head.canonical });
    if (head.noindex) meta("robots", "noindex");
    meta("og:title", head.title, "property");
    meta("og:description", head.description, "property");
    meta("og:type", head.type ?? "website", "property");
    meta("og:url", head.canonical, "property");
    meta("og:site_name", "Aaron Ho", "property");
    meta("twitter:card", "summary");
    meta("article:published_time", head.publishedTime, "property");
    meta("article:modified_time", head.modifiedTime, "property");
    for (const tag of head.tags ?? []) meta("article:tag", tag, "property");
  });

  onBeforeUnmount(() => {
    stop();
    clearManaged();
    document.title = originalTitle;
  });
}
