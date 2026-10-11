# Writing and the ML × Bio Reading Club

How to write, preview, and publish articles, and how to manage the reading
roadmap. Everything is plain files in this repo; there is no admin panel.

## Where things live

| What | File |
| --- | --- |
| Articles (one Markdown file each) | `src/content/blog/<slug>.md` |
| Article images | `public/blog/<slug>/` |
| Reading roadmap (order = file order) | `src/content/reading-club/roadmap.js` |
| Meeting settings (links, time zone label) | `src/content/reading-club/config.js` |
| Site settings, series, topic labels | `src/content/site.config.js` |
| Templates used by the scaffold command | `src/content/templates/` |
| Formatting reference (a draft) | `src/content/blog/formatting-example.md` |

Pages: `/#/blog`, `/#/blog/<slug>`, `/#/reading-club`. The site uses hash
routing, so every in-app URL has `/#` in front.

## Writing an article

### Create a general article

```sh
npm run new:post -- "Why I am learning single-cell analysis"
# optional: --slug custom-slug --tags single-cell,reflection
```

This creates `src/content/blog/why-i-am-learning-single-cell-analysis.md` with
`draft: true` and today's date. You can also copy
`src/content/templates/article.md` by hand. The file name (minus `.md`) is the
URL slug unless the front matter sets `slug:`.

General articles are free-form. Only these fields are required:

```yaml
---
title: "Why I am learning single-cell analysis"
description: "One or two sentences for the index, RSS, and link previews."
date: 2026-10-25          # YYYY-MM-DD, publication date
draft: true               # remove or set false to publish
tags: [single-cell, reflection]
# updated: 2026-11-02     # optional, shown as "Updated"
# slug: custom-slug       # optional, otherwise the file name
---
```

### Create a reading-club article

```sh
npm run new:post -- "BERT, explained for biologists" --club --paper bert
```

`--paper` takes a roadmap `id` and fills in the paper title and link. The
template adds suggested sections (problem, core idea, one technical detail,
evidence and limitations, biotech relevance, a small implementation, what I
learned, references). They are writing aids; rename or delete freely.

Reading-club front matter adds:

```yaml
series: ml-bio-reading-club
paperId: bert                          # roadmap id; links article and paper
paperTitle: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"
paperUrl: "https://arxiv.org/abs/1810.04805"
# paperAuthors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova"
# codeUrl: https://github.com/you/notebook     # shown only when set
# discussionUrl: https://...                    # shown only when set
```

Keep `paperTitle` and `paperUrl` even though the roadmap has them. They keep
the article complete if the paper is ever removed from the roadmap.

### Preview locally

```sh
npm run dev
```

Open the URL Vite prints and go to `/#/blog`. On the dev server, drafts and
future-dated posts are listed with a "Draft" or "Scheduled" badge and a notice
on the article page. The page reloads when you save the Markdown file.

To see exactly what production will contain:

```sh
npm run build && npm run preview
```

### Publish

1. In the article's front matter, delete `draft: true` (or set `draft: false`)
   and set `date:` to the publication day.
2. Run `npm test` and `npm run build` to catch front matter mistakes.
3. Commit and push to `main`. The existing GitHub Actions workflow builds and
   deploys the site.

**How the publication rule works:** a post is public when it is not a draft
and its `date` is today or earlier (in `site.timeZone`, America/Los_Angeles by
default). The same rule drives the blog index, article routes, the
reading-club archive, related posts, `rss.xml`, and `sitemap.xml`. Drafts and
future-dated posts are not in the production build at all, not merely hidden,
and their `public/blog/<slug>/` image folders are deleted from `dist/`.

**Future-dated posts need a rebuild.** The site is static, so a post dated
next Sunday appears only after a build on or after that date: push any
commit, or run the deploy workflow manually (Actions tab > Deploy to GitHub
Pages > Run workflow).

### Formatting

See `src/content/blog/formatting-example.md` (a draft) for a live example of
everything below.

- **Headings:** `##` and `###`. Articles with three or more get a table of
  contents automatically.
- **Links to site pages:** write plain paths, like `[roadmap](/reading-club)`
  or `[post](/blog/other-slug)`. They are rewritten for hash routing.
- **Images:** put files in `public/blog/<slug>/` and reference them with an
  absolute path. Add a title in quotes to get a caption; the image must be
  alone on its line:

  ```md
  ![Alt text describing the image](/blog/my-post/umap.png "Caption shown under the figure.")
  ```

- **Equations:** `$inline$` and, on their own lines, `$$ display $$`
  (KaTeX, rendered at build time).
- **Code:** fenced blocks with a language name (`python`, `r`, `bash`, `js`,
  `yaml`, ...) get syntax highlighting. Long lines scroll horizontally.
- **Tables:** standard Markdown pipe tables; they scroll on small screens.
- Raw HTML is allowed for anything else.
- Files whose names start with `_` are ignored, which is handy for notes.

## Managing the reading roadmap

The roadmap is the `papers` array in `src/content/reading-club/roadmap.js`.
**The order of entries in that file is the order on the page.** There is no
order number to maintain, and nothing is sorted by title, year, status, or
date. The numbers on the page are computed from the position.

Every entry has a stable `id` (like `bert`). Never derive it from the title,
and do not change it once an article uses it as `paperId`.

### Add a paper

Copy this block, fill it in, and paste it where it belongs in the list
(between two existing `{ ... },` entries):

```js
  {
    id: "esm2",
    title: "Evolutionary-scale prediction of atomic-level protein structure with a language model",
    authors: ["Zeming Lin", "Halil Akin", "Roshan Rao", "..."],  // optional; list all 15 authors in a real entry
    year: 2023,
    venue: "Science",                                       // optional
    url: "https://www.science.org/doi/10.1126/science.ade2574",
    question: "What does a protein language model learn about structure from sequence alone?",
    concept: "Protein language models.",
    prerequisites: ["Transformers (see the BERT entry)", "Basics of protein structure"],
    bioConnection: "Structure prediction and variant-effect scoring from sequence.",
    exercise: "Embed a few protein families and check whether they cluster.",
    topics: ["proteins", "sequences"],
    status: "backlog",
  },
```

Check author lists and years against the paper before committing. Required
fields are `id`, `title`, `year`, `url`, and `status`; the rest are optional.

### Remove a paper

Delete its whole `{ ... },` block. Example: to drop BERT, remove everything
from the `{` above `id: "bert",` through the matching `},`.

Articles about a removed paper are not deleted and keep working. Their page
shows the paper title and link from their own front matter (`paperTitle`,
`paperUrl`). The build prints a warning such as
`article "bert-notes": paperId "bert" is not in the roadmap`, but it does not
fail. Delete or update the article's `paperId` if you want to silence it.

### Reorder papers

Cut a whole entry and paste it at the new position. For example, to read
a newly added paper before BERT, move the block containing its `id` to
directly after `export const papers = [`.

Moving an entry keeps its `id`, `status`, `sessionDate`, `sessionTime`, and
`articleSlug`, because they live inside the entry.

### Change a paper's status

Edit `status:` on the entry:

| Status | Meaning |
| --- | --- |
| `backlog` | Under consideration |
| `scheduled` | Has a session date |
| `discussed` | The session happened |
| `published` | The write-up is out |

Status describes the paper, not the article. A `published` status never
publishes an article: the write-up link appears only when the article itself
is published (not a draft, date reached).

### Schedule a session

Add a date (and optionally a time) to the entry. Do not move it:

```js
    sessionDate: "2026-10-25",   // YYYY-MM-DD
    sessionTime: "19:00",        // optional, 24-hour
    status: "scheduled",
```

The date shows on that paper's card. Moving the entry keeps its date. After
the session, change `status` to `discussed` (or `published` once the write-up
is out).

### Link an article to a paper

Either set `paperId: <id>` in the article's front matter (recommended), or set
`articleSlug: "<article-slug>"` on the roadmap entry. If both exist, the
explicit `articleSlug` wins. The link shows only when the article is
published.

### Meeting, code, and discussion links

- Standing links for the whole club: `meetingUrl`, `discussionUrl`, and
  `codeRepoUrl` in `src/content/reading-club/config.js`. Set `timeZoneLabel`
  (e.g. `"PT"`) to show it after session times.
- Per-session links: `codeUrl` and `discussionUrl` on a roadmap entry.
- Per-article links: `codeUrl` and `discussionUrl` in front matter.

Anything left `null` or unset is hidden; there are no placeholder buttons.

## Checks and errors

`npm run build` fails, naming the file or entry, when:

- front matter is missing `title`, `description`, or a valid `date`, or has a
  malformed field (non-boolean `draft`, bad URL, invalid slug);
- two articles share a slug;
- a roadmap entry is malformed or two entries share an `id`.

It only warns (and still builds) for cross-references: an article whose
`paperId` is no longer in the roadmap, an `articleSlug` that is unpublished or
missing, or a `published` paper without a published article. In
`npm run dev`, the same warnings appear in the terminal and at the top of
`/#/reading-club`.

`npm test` runs the focused tests in `tests/`.
