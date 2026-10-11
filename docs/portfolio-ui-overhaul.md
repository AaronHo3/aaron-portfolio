# Portfolio UI overhaul: plan and progress

Editorial research-portfolio redesign of aaronho.dev. This file tracks scope,
decisions, and validation so work can resume after a context reset. Blog and
reading-club authoring is documented separately in [writing.md](./writing.md).

## Inventory (2026-10-10)

Routes (hash routing, `src/router/index.js`): `/`, `/projects`,
`/projects/:slug` (4 visible case studies), `/about`, `/contact`, `/blog`,
`/blog/:slug`, `/reading-club`. Resume: `public/Aaron_Ho_Resume.pdf`.

Content sources (unchanged workflows):
- Projects: `src/data/projects.js` (CLAUDE.md: numbers must match each repo).
- Blog: `src/content/blog/*.md`; roadmap: `src/content/reading-club/roadmap.js`.
- Experience on Home/About: the resume PDF is the verified source.

Dead code found: `Navbar.vue`, `HeroOrb3D.vue`, `ShaderBackground.vue` (the
only `three` import) were unused.

## Theme bug diagnosis

The reported "toggle label changes but the page stays dark" was not specific
to Writing. `theme.css` defined two dark palettes (`:root` and
`[data-theme="dark"]`), so "light" was dark everywhere. `ThemeToggle.vue` also
wrote `localStorage.theme` on every load, so every past visitor had "dark"
saved without choosing it.

Fix: real light tokens on `:root`, dark tokens on `[data-theme="dark"]`. The
choice is stored under a new key, `theme-preference`, written only when the
visitor clicks the toggle. The legacy `theme` key is ignored, so first-time and
past visitors get the light default. An inline script in `index.html` applies
the saved choice before first paint (no flash).

## Decisions

| Decision | Why |
| --- | --- |
| Keep nav label "Blogging" (spec says "Writing") | Aaron renamed it on 2026-10-10; repo content is authoritative |
| Keep the reading-club page without the format and next-session blocks | Aaron removed them on 2026-10-10 ("I will probably not be on time") |
| Tokens in `src/styles/theme.css`; light default, dark via `data-theme` | One source for color, type, spacing, radius, shadow, width, motion |
| New `SiteHeader.vue` / `SiteFooter.vue` replace TubelightNavbar, ThemeToggle dock, build stamp | Spec: restrained nav, theme control in header, no build timestamp |
| Remove scroll reveal, page transitions, scroll-progress bar, cursor glow, tilt, shimmer | Spec: no invisible-until-observed content, no unnecessary motion |
| New optional project fields: `displayTitle`, `cardSummary`, `highlight`, `thumbnail`, `imageCaption`, `context`, `status`, `channels` | Card/case-study needs without rewriting the full content; full titles kept |
| `findings` items may be `{ title, text }`; `problem`/`approach` may be arrays of paragraphs | Readable units; wording unchanged (split at sentence boundaries only) |
| Simplified SVG thumbnails in `public/thumbnails/` | Detailed diagrams are unreadable at card size; detailed figures stay on case-study pages |
| Thumbnail numbers only where they appear verbatim in projects.js | No invented data |
| Experience from the resume PDF, roles as titled there | Spec: do not inflate roles or attribute employer outcomes |
| Contact form stays mailto, relabelled "Open email draft" | No backend exists; spec forbids adding one in this task |
| Router `meta.title` sets per-page titles; blog pages keep `usePageHead` | Pages had the static index.html title |

## Status

- [x] Tokens, base styles, fonts (preconnect link, not CSS @import), theme fix
- [x] Header (desktop nav, mobile menu, theme toggle, Resume), footer, skip link, App shell
- [x] Home (hero + actions, background from resume, 3 featured cards, writing/club preview, contact band)
- [x] Projects index (2-column grid, labelled search/filters derived from content, grid/list toggle, count, reset, empty state) + SVG thumbnails
- [x] Case-study template (metadata, at a glance, captioned figure with full-size link, question, approach, findings with headings, supporting results table, limitations, next steps, section menu, related projects)
- [x] Blog index, article page, reading club, paper card restyled on tokens
- [x] About (editorial sections, values as text, focus areas as a plain list, background timeline, photos with captions)
- [x] Contact (dominant email, copy button with status, honest "Open email draft" form with validation)
- [x] Removed dead components (Navbar, TubelightNavbar, ThemeToggle, TextShimmer, HeroOrb3D, ShaderBackground) and the unused `three` dependency
- [x] Validation (see below)

## Validation (2026-10-10)

- `npm run build`: passes. Main CSS 53 KB -> 28 KB; main JS 162 KB -> 178 KB (Home now
  imports blog/roadmap metadata and profile data).
- `npm test`: 36 tests pass (adds `tests/mailto.test.js` for draft encoding and validation).
- No lint or type-check tooling exists in this repo; none run.
- Content fidelity: a script compared every original `projects.js` field before and after the
  restructure; 0 differences (text was only split at sentence boundaries or wrapped).
- Contrast (WCAG): all text pairs >= 4.5:1 in both themes; control borders >= 3:1
  (`--color-control-border`); syntax colors adjusted to >= 5:1.
- Browser (Playwright, dev server): all 11 routes (7 pages + 4 case studies + draft article)
  at 375, 768, 1280, 1440px: one h1 each, correct titles, no horizontal overflow, no console
  errors. Theme: light on first visit, legacy key ignored, toggle on Blogging switches every
  route, persists after reload. Keyboard: skip link is first tab stop; mobile menu opens with
  Enter, Escape closes and returns focus; navigation moves focus to main. Anchors land 80px
  from top, below the 65px header. Filters, empty state, reset, list toggle, details,
  copy-email status, and form validation all verified (no message was submitted).
- Before/after screenshots were captured locally (not committed).
- Independent code review: no critical/high issues; content fidelity confirmed against HEAD and
  the resume. Fixed: Neural Decoding card highlight now states -0.7 pp (matched the thumbnail),
  figure alt text no longer repeats the caption, Heart Disease highlight names the model,
  mailto normalizes message line breaks to CRLF.
- To confirm with Aaron: the education details "Focus: AI-driven biomedical modeling and
  decision analytics" and "completed and defended an undergraduate thesis" come from the
  previous Home page, not the resume.

## Remaining / follow-ups

- Hash routing still limits SEO and social previews (see blog-implementation-progress.md).
- GutSense "At a glance" lists the award next to technical facts; the award is also stated
  separately in Context. A future pass could split recognition from capability stats.
- No real demo media exists for Score the Story, so none was added.
- Images: the Sequoia photo was re-encoded to 1200px (453 KB -> 321 KB); other photos are
  already small. No responsive `srcset` yet.

## Follow-up changes (2026-10-10, later)

- Added the Mount Auburn Hospital role (Jun 2023 to Jun 2024) to `profile.js`, titled
  "Certified Medical Assistant" as on the resume; `unit` and `summary` are now optional.
- Added the Fantasy Draft Copilot project (`fantasy-basketball-draft-copilot`) from
  github.com/AaronHo3/fantasy_draft_simulator. Every number comes from that repo's
  docs/EVALUATION.md, MODEL_CARD.md, DECISIONS.md, GAMES_PLAYED_ABLATION.md, and BENCHMARKS.md,
  including the negative results (refined simulation layer, roster-aware weighting) and the
  "retrospective and potentially leaky" caveat. New category "Sports Analytics" appears in the
  filter automatically.
- Projects page intro rewritten in a friendlier voice.
- Education lines ("Focus: AI-driven biomedical modeling..." and "completed and defended an
  undergraduate thesis") confirmed correct by Aaron.
- Added Courtside Research (`courtside-research-nba-analytics`) from the README and
  docs/LIMITATIONS.md of github.com/AaronHo3/nba_advanced_statistics. That repo is PRIVATE, so
  `links.github` is empty (a public link would 404) and `status` says so; when the repo is made
  public, set `links.github` and drop the "code repository is currently private" clause.
- Default theme switched to dark at Aaron's request (2026-10-10). index.html sets
  `data-theme="dark"` before first paint unless `theme-preference` is "light"; the toggle still
  offers light and remembers it.
