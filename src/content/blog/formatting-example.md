---
title: "Formatting example (draft, not for publication)"
description: "A reference draft that shows every supported element: headings, lists, quotes, figures, tables, code, and math."
date: 2026-10-10
draft: true
tags: [generative-models, tutorial]
series: ml-bio-reading-club
paperId: vae
paperTitle: "Auto-Encoding Variational Bayes"
paperUrl: "https://arxiv.org/abs/1312.6114"
paperAuthors: "Diederik P. Kingma, Max Welling"
---

> **This is a formatting reference, not an article.** It is marked
> `draft: true`, so it only appears on the local dev server and is never
> included in a production build. Copy pieces of it when writing real posts.

## Headings and text

Use `##` for sections and `###` for subsections. Both appear in the table of
contents when an article has three or more of them. Inline styles: **bold**,
*italic*, `inline code`, and [an external link](https://arxiv.org/abs/1312.6114).
Links to other pages on the site use plain paths, like
[the reading club](/reading-club).

### Lists

1. Ordered lists for steps.
2. Second step.

- Unordered lists for loose points.
- Another point.

### Blockquotes

> Use blockquotes for short excerpts from a paper, with the source named
> nearby.

## Figures with captions

A standalone image with a title becomes a figure with a caption. Put image
files in `public/blog/<slug>/`.

![Diagram of an encoder mapping x to a latent variable z and a decoder mapping z back to a reconstruction](/blog/formatting-example/latent-sketch.svg "A VAE in one picture: encode, sample a latent, decode.")

## Equations

Inline math uses single dollar signs, like $q_\phi(z \mid x)$. Display math
uses double dollar signs on their own lines:

$$
\log p_\theta(x) \ge \mathbb{E}_{q_\phi(z \mid x)}\left[\log p_\theta(x \mid z)\right] - D_{\mathrm{KL}}\left(q_\phi(z \mid x) \,\|\, p(z)\right)
$$

## Code

Fenced code blocks with a language name get syntax highlighting. Long lines
scroll horizontally instead of breaking the layout.

```python
import numpy as np

rng = np.random.default_rng(0)


def reparameterize(mu: np.ndarray, log_var: np.ndarray) -> np.ndarray:
    """Sample z = mu + sigma * eps so gradients can flow through mu and sigma."""
    eps = rng.standard_normal(mu.shape)
    return mu + np.exp(0.5 * log_var) * eps


z = reparameterize(mu=np.zeros(2), log_var=np.zeros(2))
print(z.shape)  # (2,)
```

## Tables

| Element    | Markdown                      | Notes                         |
| ---------- | ----------------------------- | ----------------------------- |
| Figure     | `![alt](src "Caption")`       | Must be alone on its line     |
| Equation   | `$...$` or `$$...$$`          | Rendered at build time        |
| Code       | Fenced block with a language  | Scrolls horizontally          |
| Table      | Pipes and dashes              | Scrolls on narrow screens     |

## References

- Kingma, D. P., and Welling, M. Auto-Encoding Variational Bayes.
  [arXiv:1312.6114](https://arxiv.org/abs/1312.6114)
