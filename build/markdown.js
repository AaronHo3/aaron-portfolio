/**
 * Build-time Markdown renderer for blog articles.
 *
 * Runs in Node inside the Vite plugin, so markdown-it, highlight.js, and the
 * KaTeX renderer never reach the browser bundle. Output conventions that the
 * article styles (src/styles/prose.css) rely on:
 *   - h2/h3 get stable ids and are collected into a table of contents
 *   - code blocks: <div class="codeBlock"> with a focusable, scrollable <pre>
 *   - tables and display math: wrapped in focusable horizontal-scroll regions
 *   - ![alt](src "Caption") on its own line becomes <figure> + <figcaption>
 *   - links to in-app routes ("/blog/x") are rewritten for hash routing
 *   - same-page anchors ("#intro") become "/#/blog/<slug>#intro" so they also
 *     work when opened in a new tab
 *   - external links open in a new tab with rel="noopener noreferrer"
 */
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/common";
import katexPlugin from "@vscode/markdown-it-katex";

const katex = katexPlugin.default ?? katexPlugin;

/** "The Core Idea (in plain words)" -> "the-core-idea-in-plain-words" */
export function slugifyHeading(text) {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
  return slug || "section";
}

/** Plain text of an inline token (drops emphasis markers, keeps code text). */
function inlineText(token) {
  return (token.children ?? [])
    .filter((c) => c.type === "text" || c.type === "code_inline")
    .map((c) => c.content)
    .join("");
}

/** Core rule: heading ids + TOC, and figure detection for lone titled images. */
function structureRule(state) {
  const used = new Map();
  const toc = [];
  let h1Count = 0;
  const tokens = state.tokens;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t.type === "heading_open" && t.tag === "h1") h1Count += 1;

    if (t.type === "heading_open" && (t.tag === "h2" || t.tag === "h3")) {
      const text = inlineText(tokens[i + 1]);
      const base = slugifyHeading(text);
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      const id = count ? `${base}-${count + 1}` : base;
      t.attrSet("id", id);
      toc.push({ level: Number(t.tag.slice(1)), id, text });
    }

    // A paragraph whose only content is one image with a title -> <figure>
    if (t.type === "paragraph_open" && tokens[i + 1]?.type === "inline") {
      const children = tokens[i + 1].children ?? [];
      const onlyImage = children.length === 1 && children[0].type === "image";
      if (onlyImage && children[0].attrGet("title")) {
        children[0].meta = { ...(children[0].meta ?? {}), figure: true };
        t.hidden = true;
        tokens[i + 2].hidden = true;
      }
    }
  }
  state.env.toc = toc;
  state.env.h1Count = h1Count;
}

/**
 * @returns {MarkdownIt}
 */
export function createMarkdown() {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: false });
  md.use(katex, { throwOnError: false });
  md.core.ruler.push("blog_structure", structureRule);

  const escape = md.utils.escapeHtml;

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = token.info.trim().split(/\s+/)[0] ?? "";
    const known = lang && hljs.getLanguage(lang);
    const body = known
      ? hljs.highlight(token.content, { language: lang, ignoreIllegals: true }).value
      : escape(token.content);
    const label = lang ? `<span class="codeLang">${escape(lang)}</span>` : "";
    const aria = lang ? `${escape(lang)} code` : "Code";
    const cls = known ? `hljs language-${escape(lang)}` : "hljs";
    return `<div class="codeBlock">${label}<pre tabindex="0" role="region" aria-label="${aria}"><code class="${cls}">${body}</code></pre></div>\n`;
  };

  md.renderer.rules.table_open = () =>
    '<div class="tableWrap" tabindex="0" role="region" aria-label="Table"><table>\n';
  md.renderer.rules.table_close = () => "</table></div>\n";

  const mathBlock = md.renderer.rules.math_block;
  md.renderer.rules.math_block = (...args) =>
    `<div class="mathBlock" tabindex="0" role="region" aria-label="Equation">${mathBlock(...args)}</div>\n`;

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const src = escape(token.attrGet("src") ?? "");
    const alt = escape(self.renderInlineAsText(token.children ?? [], options, env));
    const title = token.attrGet("title");
    const img = `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
    if (token.meta?.figure) {
      return `<figure>${img}<figcaption>${md.renderInline(title ?? "")}</figcaption></figure>\n`;
    }
    return title ? img.replace("<img ", `<img title="${escape(title)}" `) : img;
  };

  const defaultLinkOpen =
    md.renderer.rules.link_open ?? ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const href = token.attrGet("href") ?? "";
    if (/^https?:\/\//i.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    } else if (isAppRoute(href)) {
      token.attrSet("href", `/#${href}`);
    } else if (href.startsWith("#") && !href.startsWith("#/") && env?.slug) {
      token.attrSet("href", `/#/blog/${env.slug}${href}`);
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  return md;
}

/** "/blog/x" or "/reading-club" are app routes; "/blog/x/fig.png" is a file. */
function isAppRoute(href) {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return false;
  const lastSegment = href.split(/[?#]/)[0].split("/").pop() ?? "";
  return !lastSegment.includes(".");
}

const shared = createMarkdown();

/**
 * @param {string} source Markdown body (front matter already removed)
 * @param {{ slug?: string }} [context] article slug, used for same-page anchors
 * @returns {{ html: string, toc: { level: number, id: string, text: string }[], h1Count: number }}
 */
export function renderMarkdown(source, context = {}) {
  const env = { slug: context.slug };
  const html = shared.render(source, env);
  return { html, toc: env.toc ?? [], h1Count: env.h1Count ?? 0 };
}
