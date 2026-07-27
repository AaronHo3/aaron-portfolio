# Project context

Aaron Ho's personal portfolio, live at https://aaronho.dev. Vue 3 + Vite + vue-router
(hash routing) + three.js. Deploys automatically via GitHub Actions on push to `main`;
`dist/` is gitignored, so do not commit build output.

Audience is research labs and PhD admissions committees, not recruiters. Content should read
like someone who does research, which means honest limitations and negative results are
assets rather than things to hide.

## Where content lives

**`src/data/projects.js` is the single source for all project content.** The schema is
documented in a comment at the top of that file. Core fields apply to every project; the
optional `caseStudy` block turns an entry into a full case-study page rendered by
`src/pages/ProjectDetail.vue`.

Adding or editing a project means editing that data file, not the Vue components.

## The rule that matters most

**Every project entry must match what its linked repository actually shows.** These entries
make quantitative claims, so a stale entry is a false claim on a public site.

This has already gone wrong once. The `imagined-handwriting-decoding` entry advertised
"+17pp gain from Poisson vs Gaussian HMM alignment" and a 55.86% best CER, both from a
preliminary study that the repository later superseded: the alignment comparison turned out
to be circular, and the CER came from unseeded runs that were never committed. It was
corrected in commit `59e0366`.

Before editing any project entry, read the linked repo's own writeup and use its numbers.
Sources of truth:

| Slug | Source of truth |
|---|---|
| `imagined-handwriting-decoding` | `Coding\Neural_handwriting_decoding\neural_decoding_imagined_handwriting\docs\RQ1_alignment_error_types.md` |
| `uci-heart-disease-ml` | `REPORT.md` in the UCI_Heart_Disease_ML repo |

## Conventions

- **No em dashes.** Use commas, colons, semicolons, parentheses or hyphens.
- Prefer specific numbers with context over superlatives. Compare the `uci-heart-disease-ml`
  and `imagined-handwriting-decoding` entries for the intended register.
- `limitations` and `future` are not filler. They are a large part of why this site reads as
  research rather than marketing. Keep them honest and specific.
- Run `npm run build` before committing; it catches syntax errors in `projects.js` that the
  dev server may tolerate.

## Commands

```bash
npm run dev      # local preview
npm run build    # production build, also a syntax check on projects.js
```
