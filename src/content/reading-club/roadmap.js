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
 * because those live inside the entry. The "next session" is picked by the
 * earliest future `sessionDate`, not by position.
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
    id: "u-net",
    title: "U-Net: Convolutional Networks for Biomedical Image Segmentation",
    authors: ["Olaf Ronneberger", "Philipp Fischer", "Thomas Brox"],
    year: 2015,
    venue: "MICCAI 2015",
    url: "https://arxiv.org/abs/1505.04597",
    question:
      "How can a network produce precise pixel-level masks when only a few annotated images exist?",
    concept: "Image segmentation with an encoder-decoder and skip connections.",
    prerequisites: ["Convolutions and pooling", "Cross-entropy loss", "Basic image augmentation"],
    bioConnection:
      "Cell and nucleus segmentation is the first step of most microscopy pipelines, from cell counting to spatial omics.",
    exercise: "Segment cells in a small public microscopy dataset and look at where the masks fail.",
    topics: ["imaging", "segmentation"],
    status: "backlog",
  },
  {
    id: "vae",
    title: "Auto-Encoding Variational Bayes",
    authors: ["Diederik P. Kingma", "Max Welling"],
    year: 2013,
    venue: "ICLR 2014",
    url: "https://arxiv.org/abs/1312.6114",
    question: "How do you fit a latent-variable model when the true posterior is intractable?",
    concept: "Latent variables, variational inference, and the reparameterization trick (VAEs).",
    prerequisites: ["Probability densities and expectations", "KL divergence", "Backpropagation"],
    bioConnection:
      "Many generative models of gene expression, scVI included, build on this framework to learn compact cell states from noisy data.",
    exercise:
      "Train a small VAE on simulated expression data and check whether the latent space recovers the simulated cell states.",
    topics: ["generative-models", "representation-learning"],
    status: "backlog",
  },
  {
    id: "scvi",
    title: "Deep generative modeling for single-cell transcriptomics",
    authors: ["Romain Lopez", "Jeffrey Regier", "Michael B. Cole", "Michael I. Jordan", "Nir Yosef"],
    year: 2018,
    venue: "Nature Methods",
    url: "https://www.nature.com/articles/s41592-018-0229-2",
    question:
      "What has to change when a VAE meets sparse, count-valued single-cell RNA-seq with batch effects?",
    concept: "scVI: adapting a deep generative model to single-cell count data.",
    prerequisites: [
      "Variational autoencoders (see the VAE entry)",
      "What a single-cell count matrix contains",
      "Negative binomial distribution",
    ],
    bioConnection:
      "A computational biology method in its own right, used for batch integration, clustering, and differential expression.",
    exercise: "Examine cell embeddings and batch effects in a small public single-cell dataset.",
    topics: ["single-cell", "generative-models", "genomics"],
    status: "backlog",
  },
  {
    id: "transformer",
    title: "Attention Is All You Need",
    authors: [
      "Ashish Vaswani",
      "Noam Shazeer",
      "Niki Parmar",
      "Jakob Uszkoreit",
      "Llion Jones",
      "Aidan N. Gomez",
      "Łukasz Kaiser",
      "Illia Polosukhin",
    ],
    year: 2017,
    venue: "NeurIPS 2017",
    url: "https://arxiv.org/abs/1706.03762",
    question: "Can a sequence model rely on attention alone, without recurrence or convolution?",
    concept: "Self-attention and the transformer architecture.",
    prerequisites: ["Matrix multiplication and softmax", "Embeddings", "Sequence-to-sequence models (helpful)"],
    bioConnection:
      "Transformers underpin DNA, RNA, and protein language models and many single-cell foundation models.",
    exercise: "Visualize attention on a toy DNA sequence task, such as finding a planted motif.",
    topics: ["sequences", "genomics", "proteins"],
    status: "backlog",
  },
  {
    id: "gcn",
    title: "Semi-Supervised Classification with Graph Convolutional Networks",
    authors: ["Thomas N. Kipf", "Max Welling"],
    year: 2016,
    venue: "ICLR 2017",
    url: "https://arxiv.org/abs/1609.02907",
    question: "How can graph connections help classify nodes when only a few of them are labeled?",
    concept: "Learning from graph structure by propagating features along edges.",
    prerequisites: ["Adjacency matrices", "Basic linear algebra", "The idea of semi-supervised learning"],
    bioConnection:
      "Much biological knowledge is a graph: gene regulatory networks, protein interactions, and cell neighborhoods in tissue.",
    exercise: "Compare a graph model with a feature-only baseline on a toy gene network.",
    topics: ["graphs", "genomics"],
    status: "backlog",
  },
  {
    id: "simclr",
    title: "A Simple Framework for Contrastive Learning of Visual Representations",
    authors: ["Ting Chen", "Simon Kornblith", "Mohammad Norouzi", "Geoffrey Hinton"],
    year: 2020,
    venue: "ICML 2020",
    url: "https://arxiv.org/abs/2002.05709",
    question: "How much can a model learn about images without labels, only by comparing augmented views?",
    concept: "SimCLR and contrastive self-supervised learning.",
    prerequisites: ["CNN image encoders", "Data augmentation", "Cosine similarity and softmax"],
    bioConnection:
      "Labels are expensive in microscopy and pathology; self-supervised embeddings are a common route to phenotypic profiling.",
    exercise: "Compare embeddings of augmented microscopy images.",
    topics: ["imaging", "representation-learning"],
    status: "backlog",
  },
  {
    id: "neural-ode",
    title: "Neural Ordinary Differential Equations",
    authors: ["Ricky T. Q. Chen", "Yulia Rubanova", "Jesse Bettencourt", "David Duvenaud"],
    year: 2018,
    venue: "NeurIPS 2018",
    url: "https://arxiv.org/abs/1806.07366",
    question: "What if a network's hidden state evolved continuously, governed by a learned differential equation?",
    concept: "Learning continuous dynamics with neural ODEs.",
    prerequisites: ["Ordinary differential equations", "Numerical solvers (Euler, Runge-Kutta)", "Residual networks"],
    bioConnection:
      "Cell growth, gene regulation, and differentiation are dynamical systems, often observed at irregular time points.",
    exercise: "Fit a simulated cell-growth trajectory.",
    topics: ["dynamical-systems"],
    status: "backlog",
  },
  {
    id: "ddpm",
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Jonathan Ho", "Ajay Jain", "Pieter Abbeel"],
    year: 2020,
    venue: "NeurIPS 2020",
    url: "https://arxiv.org/abs/2006.11239",
    question: "How can learning to undo small steps of added noise produce a high-quality generative model?",
    concept: "Diffusion models and denoising.",
    prerequisites: ["Gaussian distributions", "Markov chains", "The VAE variational bound (helpful)"],
    bioConnection:
      "Diffusion models are now used to generate protein structures, small molecules, and cell images.",
    exercise: "Demonstrate diffusion on a small synthetic 2D distribution.",
    topics: ["generative-models", "proteins"],
    status: "backlog",
  },
];
