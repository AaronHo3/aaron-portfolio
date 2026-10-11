# Blog + ML × Bio Reading Club: implementation log

Working notes so this work can resume after a context reset. The authoring
guide lives in [writing.md](./writing.md); this file records decisions and
status only.

## Findings (repo inspection, 2026-10-10)

- Vue 3 + Vite 7 SPA, `vue-router` in **hash mode** (`/#/path`), npm, GitHub
  Pages via `.github/workflows/deploy.yml` (push to `main` runs `npm run build`).
- No CLAUDE.md / AGENTS.md, no tests, lint, or type checks before this work.
- Content convention: plain JS data files with a documented schema header
  (`src/data/projects.js`). No Markdown, CMS, or blog existed.
- Visual language: CSS variables in `src/styles/theme.css`, Figtree body,
  Fraunces headings, `.card` / `.btn` / chip / pill patterns, "← back" links on
  detail pages. Active nav is `TubelightNavbar.vue` (`Navbar.vue` is unused).

## Decisions

| Decision | Why |
| --- | --- |
| Markdown files in `src/content/blog/`, YAML front matter | Repo-based, no CMS, matches "content in files" convention |
| Render Markdown at **build time** in a Vite plugin (`build/blog-plugin.js`) | markdown-it, highlight.js, KaTeX renderer stay out of the client bundle; only KaTeX CSS ships |
| Drafts and future-dated posts filtered **inside the plugin** | Production builds never emit a module for them, so no hidden-but-reachable pages |
| One filter, `isPublished()` in `src/lib/content/posts.js` | Used by routes, index, archive, related posts, RSS, sitemap |
| Keep hash routing | Existing convention; migrating the site router was out of scope. All absolute URLs go through `src/lib/content/urls.js` so a future history-mode switch is one edit |
| Roadmap = array order in `src/content/reading-club/roadmap.js` | No order field, no sorting anywhere; position is display-only |
| Articles carry their own `paperTitle` / `paperUrl` | Removing a roadmap entry never breaks an article; missing references are warnings, not errors |
| Roadmap errors (duplicate IDs, malformed fields) fail the build; cross-reference issues only warn | Avoids contradictory rules where deleting a paper fails a valid article build |
| "Today" uses `site.timeZone` (America/Los_Angeles, editable) | Date-only strings compared as strings; display formatting pins UTC so dates never shift |
| Label "Blogging" in nav (renamed from "Writing" at Aaron's request), routes `/blog`, `/blog/:slug`, `/reading-club` | Spec-preferred paths; URLs unchanged by the rename |
| vitest (dev only) for focused tests, separate `vitest.config.js` | Standard for Vite, no test framework existed |

## Status

- [x] Repo inspection
- [x] Bibliographic verification (DataCite for arXiv DOIs, Crossref for Nature Methods)
- [x] Content libs: dates, posts, roadmap, urls
- [x] Build plugin: Markdown render, virtual modules, RSS, sitemap, validation
- [x] Pages: `/blog`, `/blog/:slug`, `/reading-club`; nav item
- [x] Seed roadmap, templates, formatting draft, scaffold script
- [x] 2026-10-10 revision: roadmap reduced to BERT (session 2026-10-11); "Next session" and "Format" blocks removed at Aaron's request (the page is a notes archive, not a schedule); `findNextSession` deleted
- [x] Docs: `docs/writing.md`, README link
- [x] Tests (`npm test`)
- [x] Build + browser check (see Validation)

## Validation results (2026-10-10)

- `npm test`: 32 tests pass after the revision (36 before) (tests/roadmap.test.js, tests/content.test.js).
  Covers source-order roadmap, add/remove/reorder, relationships preserved on
  move, draft/future exclusion from index, routes, RSS,
  sitemap, related posts, and dist assets, removed-paper articles, date
  handling, Markdown output.
- `npm run build`: passes; `dist/` contains no draft text or draft assets;
  `rss.xml` and `sitemap.xml` emitted with public content only.
- Manual failure checks: duplicate roadmap id fails the build with the entry
  named; removing a referenced paper builds with a warning only; a half-saved
  `roadmap.js` logs an error without killing `npm run dev`.
- Browser (Playwright, 1440px and 390px): blog index, draft article, reading
  club (empty and scheduled states, live reorder), TOC anchor scrolling,
  in-article links, existing Home/Projects/About pages and nav, no console
  warnings, no horizontal page overflow on mobile, visible keyboard focus.
- Lint and type checks: none configured in this repo; not run.
- Code review (subagent): no critical/high issues. Fixed: dev watcher crash on
  roadmap syntax errors, stale-load race between articles, malformed hash
  decoding, same-page anchors in new tabs, warning for `#` h1s in bodies.
  Not fixed (low): `public/blog/<slug>/` assets of `_`-prefixed files are not
  pruned from dist; fallback heading ids could collide with a heading titled
  "Section 2".

## Remaining / follow-ups

- Hash routing limits SEO: crawlers ignore `#/...`, so sitemap and canonical
  URLs are best-effort, and social previews only see the static `index.html`.
  A follow-up could switch to history mode with per-route HTML (GitHub Pages
  404 fallback) and prerendering. `urls.js` centralizes the change.
- Future-dated posts need a rebuild on or after their date (push, or run the
  deploy workflow manually). A daily scheduled workflow run would automate it.
- No lint or type-check tooling exists in the repo; none added.
- `npm audit` reports pre-existing advisories in `vue` and `gh-pages`
  dependencies (not introduced by this work); left for a separate update.
