/**
 * RSS and sitemap generators. Callers must pass posts that already went
 * through `isPublished`; these functions do no filtering of their own so the
 * publication rule lives in exactly one place.
 */
import { toRfc822 } from "../src/lib/content/dates.js";
import { absoluteUrl, postPath, BLOG_PATH, READING_CLUB_PATH } from "../src/lib/content/urls.js";

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * @param {object[]} posts  public posts, newest first
 * @param {{ url: string, title: string, blogTitle: string, blogDescription: string, author: string }} site
 */
export function buildRss(posts, site) {
  const items = posts
    .map((p) => {
      const link = absoluteUrl(postPath(p.slug));
      const categories = p.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join("\n");
      return [
        "    <item>",
        `      <title>${xmlEscape(p.title)}</title>`,
        `      <link>${xmlEscape(link)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
        `      <pubDate>${toRfc822(p.date)}</pubDate>`,
        `      <description>${xmlEscape(p.description)}</description>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuild = posts[0] ? `\n    <lastBuildDate>${toRfc822(posts[0].updated ?? posts[0].date)}</lastBuildDate>` : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${site.blogTitle} | ${site.title}`)}</title>
    <link>${xmlEscape(absoluteUrl(BLOG_PATH))}</link>
    <description>${xmlEscape(site.blogDescription)}</description>
    <language>en-us</language>
    <atom:link href="${xmlEscape(`${site.url}/rss.xml`)}" rel="self" type="application/rss+xml" />${lastBuild}
${items}
  </channel>
</rss>
`;
}

/** Static routes listed in the sitemap alongside public articles. */
export const SITEMAP_STATIC_PATHS = ["/", "/projects", "/about", "/contact", BLOG_PATH, READING_CLUB_PATH];

/**
 * @param {object[]} posts public posts
 * @param {{ url: string }} site
 */
export function buildSitemap(posts, site) {
  const home = `${site.url}/`;
  const staticUrls = SITEMAP_STATIC_PATHS.map((path) =>
    `  <url><loc>${xmlEscape(path === "/" ? home : absoluteUrl(path))}</loc></url>`,
  );
  const postUrls = posts.map(
    (p) =>
      `  <url><loc>${xmlEscape(absoluteUrl(postPath(p.slug)))}</loc><lastmod>${p.updated ?? p.date}</lastmod></url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join("\n")}
</urlset>
`;
}
