/**
 * ML × Bio Reading Club: reading roadmap
 * ============================================================================
 * This file is the ONLY place the reading queue lives. The /reading-club page
 * renders entries in exactly the order they appear in `papers` below.
 *
 *   Add a paper     -> paste a new { ... } entry where you want it.
 *   Remove a paper  -> delete its { ... } entry. Articles about it keep working.
 *   Reorder         -> cut an entry and paste it somewhere else in the list.
 *
 * There is no order/position field and nothing is sorted. Numbers shown on the
 * page are computed from the list position, so you never renumber anything.
 *
 * Moving an entry never changes its id, session date, status, or article link,
 * because those live inside the entry.
 *
 * Fields
 * ----------------------------------------------------------------------------
 * Required
 *   id             Stable slug, e.g. "u-net". Never derived from title or
 *                  position. Do not change it once articles reference it.
 *   title          Paper title.
 *   year           First public year (number).
 *   url            Link to the original paper.
 *   status         "backlog" | "scheduled" | "discussed" | "published"
 *                  (describes the meeting, not the article; see docs/writing.md)
 * Recommended
 *   authors        ["First Author", ...]
 *   venue          e.g. "NeurIPS 2017"
 *   question       Main learning question.
 *   concept        Core ML concept.
 *   prerequisites  ["...", ...]
 *   bioConnection  Why it matters for biology.
 *   exercise       Proposed educational implementation (ours, not the paper's).
 *   topics         ["imaging", "single-cell", ...] (labels: src/content/site.config.js)
 * Optional
 *   sessionDate    "YYYY-MM-DD" (a Sunday). Omit until a date is confirmed.
 *   sessionTime    "HH:MM", 24-hour, e.g. "19:00". Requires sessionDate.
 *   articleSlug    Slug of the write-up in src/content/blog/. Only linked once
 *                  that article is published.
 *   codeUrl        Notebook or repo for this session.
 *   discussionUrl  Thread or notes for this session.
 *
 * Duplicate ids or malformed fields fail `npm run build` with a message that
 * names the entry. Full guide with copy-and-edit examples: docs/writing.md
 * ============================================================================
 */
export const papers = [
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    year: 2018,
    venue: "NAACL 2019",
    url: "https://arxiv.org/abs/1810.04805",
    question: "How far can one pre-trained model go when it learns language by filling in masked words from both directions?",
    concept: "Bidirectional transformer pre-training (masked language modeling) followed by task-specific fine-tuning.",
    prerequisites: ["Attention and the transformer encoder", "Word embeddings", "Fine-tuning a pre-trained model"],
    bioConnection:
      "The same masked-token pre-training recipe is used by DNA, RNA, and protein language models such as DNABERT and ESM.",
    exercise: "Mask tokens in short DNA or protein sequences and see what a small pre-trained model predicts.",
    topics: ["sequences", "representation-learning", "genomics", "proteins"],
    sessionDate: "2026-10-11",
    status: "scheduled",
  },
];
