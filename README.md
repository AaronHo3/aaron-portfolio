# Welcome to my portfolio page!

This repository just contains all the code used to create my page

## Writing and the reading club

Blog articles live in `src/content/blog/` as Markdown, and the ML × Bio Reading Club roadmap lives in `src/content/reading-club/roadmap.js`. See [docs/writing.md](docs/writing.md) for how to write, preview, and publish articles and how to add, remove, or reorder papers.

```sh
npm run dev                          # local preview, drafts included
npm run new:post -- "Post title"     # scaffold a draft article
npm test                             # content and roadmap tests
npm run build                        # production build (drafts excluded)
```
