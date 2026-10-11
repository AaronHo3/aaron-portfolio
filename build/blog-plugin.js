/**
 * Vite plugin: Markdown blog + reading-club validation.
 *
 * Reads src/content/blog/*.md at build/dev time and exposes:
 *   virtual:blog          -> { posts, loadPost(slug), previewMode }
 *                            `posts` is metadata only (no HTML), newest first
 *   virtual:blog-post/<slug> -> { html, toc } for one article (lazy chunk)
 *
 * Publication: `vite build` keeps only posts passing `isPublished` (not a
 * draft, date on or before today in site.timeZone). Drafts and future-dated
 * posts are never turned into modules, so they are absent from dist/ entirely.
 * `vite` (dev server) includes them so they can be previewed; the UI labels them.
 *
 * Assets: images for a post live in public/blog/<slug>/. Vite copies public/
 * verbatim, so after a build the plugin deletes dist/blog/<slug>/ for every
 * draft or future-dated post. Folders not named after a post are left alone.
 *
 * Validation: malformed front matter, duplicate slugs, and malformed roadmap
 * entries fail the build. Cross-reference problems (a removed paper, an
 * unpublished linked article) are printed as warnings only.
 */
import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";

import { renderMarkdown } from "./markdown.js";
import { buildRss, buildSitemap } from "./feeds.js";
import { todayIn } from "../src/lib/content/dates.js";
import {
  isPublished,
  normalizePost,
  publicationState,
  readingMinutes,
  selectPosts,
} from "../src/lib/content/posts.js";
import { validateRoadmap, crossCheckRoadmap } from "../src/lib/content/roadmap.js";
import { site } from "../src/content/site.config.js";

const VIRTUAL_INDEX = "virtual:blog";
const VIRTUAL_POST_PREFIX = "virtual:blog-post/";
const RESOLVED_INDEX = `\0${VIRTUAL_INDEX}`;
const RESOLVED_POST_PREFIX = `\0${VIRTUAL_POST_PREFIX}`;

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * Split a Markdown file into parsed front matter and body.
 * @param {string} raw
 * @param {string} file for error messages
 */
export function splitFrontMatter(raw, file) {
  const match = FRONT_MATTER.exec(raw);
  if (!match) return { data: null, body: raw, error: `${file}: file must start with a --- front matter block ---` };
  try {
    return { data: parseYaml(match[1]) ?? {}, body: raw.slice(match[0].length), error: null };
  } catch (err) {
    return { data: null, body: "", error: `${file}: invalid YAML front matter: ${err.message}` };
  }
}

/**
 * Load, validate, and render every article in `contentDir`.
 * Files starting with "_" are ignored (handy for parking notes).
 *
 * @param {{ contentDir: string, today: string, includeUnpublished: boolean }} opts
 * @returns {Promise<{ all: object[], visible: object[], errors: string[], warnings: string[] }>}
 */
export async function loadBlogContent({ contentDir, today, includeUnpublished }) {
  const errors = [];
  const warnings = [];
  let files = [];
  try {
    files = (await readdir(contentDir)).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort();
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  const all = [];
  const slugOwner = new Map();
  for (const name of files) {
    const file = path.join(path.basename(contentDir), name);
    const raw = await readFile(path.join(contentDir, name), "utf8");
    const { data, body, error } = splitFrontMatter(raw, file);
    if (error) {
      errors.push(error);
      continue;
    }
    const result = normalizePost(data, { fileSlug: name.replace(/\.md$/, ""), file });
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    if (!result.post) continue;

    if (slugOwner.has(result.post.slug)) {
      errors.push(`${file}: slug "${result.post.slug}" is already used by ${slugOwner.get(result.post.slug)}`);
      continue;
    }
    slugOwner.set(result.post.slug, file);

    const { html, toc, h1Count } = renderMarkdown(body, { slug: result.post.slug });
    if (h1Count) {
      warnings.push(`${file}: use ## for sections; the page already shows the title as the only # heading`);
    }
    all.push({
      ...result.post,
      readingMinutes: readingMinutes(body),
      state: publicationState(result.post, today),
      html,
      toc,
    });
  }

  const visible = selectPosts(all, { today, includeUnpublished });
  return { all, visible, errors, warnings };
}

/** Metadata shipped in the index module (no HTML). */
function toMeta({ html, toc, ...meta }) {
  return meta;
}

/** Source of the `virtual:blog` module. */
export function indexModuleSource(visible, previewMode) {
  const loaders = visible
    .map((p) => `  ${JSON.stringify(p.slug)}: () => import(${JSON.stringify(VIRTUAL_POST_PREFIX + p.slug)}),`)
    .join("\n");
  return `export const previewMode = ${JSON.stringify(previewMode)};
export const posts = ${JSON.stringify(visible.map(toMeta))};
const loaders = {
${loaders}
};
export function loadPost(slug) {
  return Object.hasOwn(loaders, slug) ? loaders[slug]().then((m) => m.default) : Promise.resolve(null);
}
`;
}

/**
 * @param {{ contentDir?: string, roadmapFile?: string, today?: string }} [options]
 */
export function blogPlugin(options = {}) {
  let root = process.cwd();
  let isBuild = false;
  let logger = console;
  let outDir = "dist";
  let contentPromise = null;

  const contentDir = () => path.resolve(root, options.contentDir ?? "src/content/blog");
  const roadmapFile = () => path.resolve(root, options.roadmapFile ?? "src/content/reading-club/roadmap.js");
  const today = () => options.today ?? todayIn(site.timeZone);

  async function loadRoadmap() {
    const url = `${pathToFileURL(roadmapFile()).href}?t=${Date.now()}`;
    return (await import(url)).papers;
  }

  async function loadEverything() {
    const now = today();
    const content = await loadBlogContent({ contentDir: contentDir(), today: now, includeUnpublished: !isBuild });
    const papers = await loadRoadmap();
    const roadmap = validateRoadmap(papers);
    const errors = [...content.errors, ...roadmap.errors];
    const warnings = [...content.warnings, ...roadmap.warnings];
    if (!roadmap.errors.length) {
      warnings.push(...crossCheckRoadmap(papers, content.all, (p) => isPublished(p, now)));
    }
    return { ...content, errors, warnings };
  }

  function getContent() {
    contentPromise ??= loadEverything();
    return contentPromise;
  }

  function report(content, ctx) {
    for (const w of content.warnings) logger.warn(`[blog] warning: ${w}`);
    if (!content.errors.length) return;
    const message = `[blog] content errors:\n  - ${content.errors.join("\n  - ")}`;
    if (isBuild && ctx) ctx.error(message);
    else logger.error(message);
  }

  return {
    name: "aaron-blog",

    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
      logger = config.logger;
      outDir = path.resolve(root, config.build?.outDir ?? "dist");
    },

    async buildStart() {
      contentPromise = null;
      report(await getContent(), this);
    },

    resolveId(id) {
      if (id === VIRTUAL_INDEX) return RESOLVED_INDEX;
      if (id.startsWith(VIRTUAL_POST_PREFIX)) return `\0${id}`;
      return null;
    },

    async load(id) {
      if (id === RESOLVED_INDEX) {
        const { visible } = await getContent();
        return indexModuleSource(visible, !isBuild);
      }
      if (id.startsWith(RESOLVED_POST_PREFIX)) {
        const slug = id.slice(RESOLVED_POST_PREFIX.length);
        const post = (await getContent()).visible.find((p) => p.slug === slug);
        return `export default ${JSON.stringify(post ? { html: post.html, toc: post.toc } : null)};`;
      }
      return null;
    },

    configureServer(server) {
      server.watcher.add([contentDir(), roadmapFile()]);
      const onChange = async (file) => {
        const isPost = file.startsWith(contentDir()) && file.endsWith(".md");
        if (!isPost && file !== roadmapFile()) return;
        contentPromise = null;
        try {
          report(await getContent());
        } catch (err) {
          // e.g. a half-saved roadmap.js with a syntax error: keep the dev server alive
          contentPromise = null;
          logger.error(`[blog] could not load content: ${err.message}`);
          return;
        }
        if (!isPost) return; // roadmap.js is a normal module; Vite hot-reloads it
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (mod.id?.startsWith(RESOLVED_INDEX) || mod.id?.startsWith(RESOLVED_POST_PREFIX)) {
            server.moduleGraph.invalidateModule(mod);
          }
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
    },

    async generateBundle() {
      if (!isBuild) return;
      const { visible } = await getContent();
      this.emitFile({ type: "asset", fileName: "rss.xml", source: buildRss(visible, site) });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: buildSitemap(visible, site) });
    },

    async closeBundle() {
      if (!isBuild) return;
      const { all, visible } = await getContent();
      const publicSlugs = new Set(visible.map((p) => p.slug));
      const hidden = all.filter((p) => !publicSlugs.has(p.slug));
      await Promise.all(
        hidden.map((p) => rm(path.join(outDir, "blog", p.slug), { recursive: true, force: true })),
      );
    },
  };
}
