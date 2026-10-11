/**
 * Site-wide settings for the blog and reading club.
 * ----------------------------------------------------------------------------
 * Imported by both the browser app and the build plugin (build/blog-plugin.js),
 * so keep this file plain data: no Vite-only APIs.
 *
 *   url        Production origin, no trailing slash. Used for canonical URLs,
 *              RSS, and the sitemap.
 *   timeZone   IANA zone that defines "today" for publication dates and
 *              session dates. A post dated 2026-11-01 goes live on the first
 *              build at or after midnight on Nov 1 in this zone.
 *   series     Known series IDs (the `series:` front matter value) and how
 *              they are labelled. Unknown IDs still render, with a warning.
 *   topicLabels Display names for tags. Tags without an entry render as-is.
 * ----------------------------------------------------------------------------
 */
export const site = {
  url: "https://aaronho.dev",
  title: "Aaron Ho",
  author: "Aaron Ho",
  blogTitle: "Writing",
  blogDescription:
    "Notes on machine learning, computational biology, and the projects I am building.",
  timeZone: "America/Los_Angeles",
};

export const READING_CLUB_SERIES = "ml-bio-reading-club";

export const series = {
  [READING_CLUB_SERIES]: {
    label: "ML × Bio Reading Club",
    path: "/reading-club",
  },
};

export const topicLabels = {
  "single-cell": "Single-cell",
  imaging: "Imaging",
  genomics: "Genomics",
  proteins: "Proteins",
  graphs: "Graphs",
  "dynamical-systems": "Dynamical systems",
  "generative-models": "Generative models",
  "representation-learning": "Representation learning",
  sequences: "Sequences",
  segmentation: "Segmentation",
  "medical-ai": "Medical AI",
  ml: "Machine learning",
  reflection: "Reflection",
  projects: "Projects",
  tutorial: "Tutorial",
};
