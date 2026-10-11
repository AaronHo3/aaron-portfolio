#!/usr/bin/env node
/**
 * Scaffold a new draft article from a template.
 *
 *   npm run new:post -- "My post title"
 *   npm run new:post -- "U-Net, explained" --club --paper u-net
 *   npm run new:post -- "My post title" --slug custom-slug --tags ml,reflection
 *
 * --club   use the reading-club template (series: ml-bio-reading-club)
 * --paper  roadmap id; fills paperTitle and paperUrl from the roadmap
 *
 * Creates src/content/blog/<slug>.md with `draft: true` and today's date.
 * Refuses to overwrite an existing file.
 */
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { site } from "../src/content/site.config.js";
import { papers } from "../src/content/reading-club/roadmap.js";
import { todayIn } from "../src/lib/content/dates.js";
import { SLUG_PATTERN } from "../src/lib/content/posts.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`new:post: ${message}`);
  process.exit(1);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Double-quoted YAML scalar. */
const yamlString = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    club: { type: "boolean", default: false },
    paper: { type: "string" },
    slug: { type: "string" },
    tags: { type: "string" },
  },
});

const title = positionals.join(" ").trim();
if (!title) fail('give a title, e.g. npm run new:post -- "My post title"');

const slug = values.slug ?? slugify(title);
if (!SLUG_PATTERN.test(slug)) fail(`"${slug}" is not a valid slug (lowercase letters, digits, hyphens)`);

const club = values.club || Boolean(values.paper);
let paper = null;
if (values.paper) {
  paper = papers.find((p) => p.id === values.paper);
  if (!paper) fail(`no roadmap paper with id "${values.paper}". Known: ${papers.map((p) => p.id).join(", ")}`);
}

const target = path.join(root, "src/content/blog", `${slug}.md`);
if (existsSync(target)) fail(`${path.relative(root, target)} already exists`);

const templateName = club ? "reading-club-article.md" : "article.md";
const template = await readFile(path.join(root, "src/content/templates", templateName), "utf8");
const defaultTags = club ? (paper?.topics ?? []) : ["ml"];
const tags = values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : defaultTags;

const output = template
  .replaceAll("{{title}}", yamlString(title))
  .replaceAll("{{date}}", todayIn(site.timeZone))
  .replaceAll("{{tags}}", tags.join(", "))
  .replaceAll("{{paperId}}", paper?.id ?? "PAPER-ID-FROM-ROADMAP")
  .replaceAll("{{paperTitle}}", yamlString(paper?.title ?? "Paper title"))
  .replaceAll("{{paperUrl}}", paper?.url ?? "https://arxiv.org/abs/...");

await writeFile(target, output, "utf8");
console.log(`Created ${path.relative(root, target)} (draft). Preview with: npm run dev -> /#/blog/${slug}`);
