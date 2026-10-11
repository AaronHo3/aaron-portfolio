/**
 * Every path and absolute URL for blog content is built here.
 *
 * The site uses hash routing (see src/router/index.js), so the public URL of
 * /blog/my-post is https://aaronho.dev/#/blog/my-post. If routing ever moves
 * to history mode, change `absoluteUrl` and nothing else.
 */
import { site } from "../../content/site.config.js";

export const BLOG_PATH = "/blog";
export const READING_CLUB_PATH = "/reading-club";

/** @param {string} slug */
export const postPath = (slug) => `${BLOG_PATH}/${slug}`;

/** @param {string} path in-app route path, e.g. "/blog/my-post" */
export function absoluteUrl(path) {
  return `${site.url}/#${path}`;
}

