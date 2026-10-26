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
 *   unit           Theme this paper belongs to, e.g. "Structure prediction".
 *                  The page prints a heading wherever the unit changes from
 *                  the previous entry, so keep a unit's papers together.
 *   sessionDate    "YYYY-MM-DD" (a Sunday). Omit until a date is confirmed.
 *                  Entries sharing a date (a paper plus a companion reading)
 *                  are listed as one session in the schedule.
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
    unit: "Foundations",
    sessionDate: "2026-10-11",
    status: "published",
  },
  {
    id: "ddpm",
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Jonathan Ho", "Ajay Jain", "Pieter Abbeel"],
    year: 2020,
    venue: "NeurIPS 2020",
    url: "https://arxiv.org/abs/2006.11239",
    question: "How can a model generate new data by learning to undo noise, one small step at a time?",
    concept:
      "A fixed forward process gradually adds Gaussian noise to data; a network is trained to predict that noise so the process can be reversed step by step, starting from pure noise.",
    prerequisites: ["Gaussian distributions", "Variational autoencoders and the evidence lower bound", "U-Net architecture"],
    bioConnection:
      "Diffusion is the generative approach behind protein design tools such as RFdiffusion, which generates new protein backbones.",
    exercise: "Train a small diffusion model on a 2D toy dataset and watch samples emerge from noise across the reverse steps.",
    topics: ["generative-models", "imaging", "proteins"],
    unit: "Foundations",
    sessionDate: "2026-10-18",
    status: "published",
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
    question: "What can a sequence model do with attention alone, once recurrence and convolution are removed?",
    concept:
      "Self-attention lets every position look at every other position directly, so the whole sequence is processed in parallel rather than stepping through it in order.",
    prerequisites: ["Matrix multiplication", "Softmax", "Word embeddings"],
    bioConnection:
      "This architecture is the backbone of the protein and DNA language models later in this roadmap, including ESM-2 and ESM3.",
    exercise: "Take one short sequence and compute a single attention head by hand, from the query-key scores to the weighted sum.",
    topics: ["sequences", "representation-learning"],
    unit: "Foundations",
    sessionDate: "2026-11-01",
    status: "scheduled",
  },
  {
    id: "annotated-transformer",
    title: "The Annotated Transformer",
    authors: ["Austin Huang", "Suraj Subramanian", "Jonathan Sum", "Khalid Almubarak", "Stella Biderman"],
    year: 2022,
    venue: "Harvard NLP, companion reading",
    url: "https://nlp.seas.harvard.edu/annotated-transformer/",
    question: "What does each equation in the Transformer paper look like as running code?",
    concept:
      "A line-by-line PyTorch implementation of the Transformer, with the paper's text interleaved. The 2022 version follows the original 2018 post by Sasha Rush.",
    prerequisites: ["Attention Is All You Need (read it first)", "Basic PyTorch"],
    bioConnection:
      "Reading the implementation makes the shapes concrete, which carries over to any sequence model applied to biological data.",
    exercise: "Run the notebook and print the attention tensors' shapes at each step to connect them to the equations.",
    topics: ["sequences", "tutorial"],
    unit: "Foundations",
    sessionDate: "2026-11-01",
    status: "scheduled",
  },
  {
    id: "gcn",
    title: "Semi-Supervised Classification with Graph Convolutional Networks",
    authors: ["Thomas N. Kipf", "Max Welling"],
    year: 2016,
    venue: "ICLR 2017",
    url: "https://arxiv.org/abs/1609.02907",
    question: "How does a network learn from data whose structure is a graph rather than a grid or a sequence?",
    concept:
      "Each layer updates a node's representation by averaging over its neighbors, so information spreads a little further through the graph with every layer.",
    prerequisites: ["Matrix multiplication", "Basic graph vocabulary: nodes, edges, adjacency"],
    bioConnection:
      "Molecules, protein contact maps, and interaction networks are graphs, which is why this architecture shows up throughout computational biology.",
    exercise: "Run a two-layer GCN on a small citation graph and see how accuracy changes when edges are removed.",
    topics: ["graphs", "representation-learning"],
    unit: "Graph neural networks",
    sessionDate: "2026-11-08",
    status: "scheduled",
  },
  {
    id: "egnn",
    title: "E(n) Equivariant Graph Neural Networks",
    authors: ["Victor Garcia Satorras", "Emiel Hoogeboom", "Max Welling"],
    year: 2021,
    venue: "ICML 2021",
    url: "https://arxiv.org/abs/2102.09844",
    question: "How can a network on 3D coordinates respect the fact that rotating or moving a molecule does not change it?",
    concept:
      "Equivariance built into the architecture: the network passes messages using distances between points, so its predictions rotate and translate along with its input instead of having to learn that from data.",
    prerequisites: ["Graph convolutional networks (the previous entry)", "Rotations and translations in 3D"],
    bioConnection:
      "Proteins and small molecules are sets of 3D coordinates with no canonical orientation, so equivariance is a standard ingredient in structure and design models.",
    exercise: "Rotate an input molecule and check that an equivariant model's predictions rotate with it while a plain GNN's do not.",
    topics: ["graphs", "proteins"],
    unit: "Graph neural networks",
    sessionDate: "2026-11-15",
    status: "scheduled",
  },
  {
    id: "esm2",
    title: "Evolutionary-scale prediction of atomic-level protein structure with a language model",
    authors: ["Zeming Lin", "Halil Akin", "Roshan Rao", "Brian Hie", "Zhongkai Zhu", "Wenting Lu"],
    year: 2023,
    venue: "Science 2023",
    url: "https://www.science.org/doi/10.1126/science.ade2574",
    question: "What does a language model trained only on protein sequences learn about structure?",
    concept:
      "The masked language modeling recipe from BERT, applied to protein sequences at scale. ESMFold then predicts structure from a single sequence, with no multiple sequence alignment at inference time.",
    prerequisites: ["BERT (the first entry)", "Attention Is All You Need", "Basics of protein structure"],
    bioConnection:
      "Dropping the alignment step makes structure prediction fast enough to run on hundreds of millions of metagenomic sequences.",
    exercise: "Embed a few related protein sequences with a small ESM model and check whether the families separate.",
    topics: ["proteins", "sequences", "representation-learning"],
    unit: "Protein language models",
    sessionDate: "2026-11-22",
    status: "scheduled",
  },
  {
    id: "esm3",
    title: "Simulating 500 million years of evolution with a language model",
    authors: ["Thomas Hayes", "Roshan Rao", "Halil Akin", "Nicholas J. Sofroniew", "Deniz Oktay", "Zeming Lin"],
    year: 2025,
    venue: "Science 2025",
    url: "https://www.science.org/doi/10.1126/science.ads0018",
    question: "What changes when one model reasons over sequence, structure, and function together?",
    concept:
      "A multimodal masked language model over protein sequence, structure, and function tokens, which can be prompted with any combination of the three.",
    prerequisites: ["ESM-2 (the previous entry)", "Masked language modeling"],
    bioConnection:
      "The authors use the model to generate a new green fluorescent protein and report that it is distant from known natural ones.",
    exercise: "Compare what the model proposes when prompted with a sequence alone versus a sequence plus a structural constraint.",
    topics: ["proteins", "generative-models", "sequences"],
    unit: "Protein language models",
    sessionDate: "2026-11-29",
    status: "scheduled",
  },
  {
    id: "alphafold2",
    title: "Highly accurate protein structure prediction with AlphaFold",
    authors: ["John Jumper", "Richard Evans", "Alexander Pritzel", "Tim Green", "Michael Figurnov", "Olaf Ronneberger"],
    year: 2021,
    venue: "Nature 2021",
    url: "https://www.nature.com/articles/s41586-021-03819-2",
    question: "What combination of ideas finally made structure prediction accurate enough to be useful?",
    concept:
      "Attention over an evolutionary alignment and a pairwise representation of residues, trained end to end to produce 3D coordinates directly.",
    prerequisites: ["Attention Is All You Need", "Multiple sequence alignments", "Basics of protein structure"],
    bioConnection:
      "This is the result that made predicted structures a routine starting point in structural biology.",
    exercise: "Fold one short sequence with an open implementation and compare the per-residue confidence against the experimental structure.",
    topics: ["proteins", "graphs"],
    unit: "Structure prediction",
    sessionDate: "2026-12-06",
    status: "scheduled",
  },
  {
    id: "rosettafold",
    title: "Accurate prediction of protein structures and interactions using a three-track neural network",
    authors: ["Minkyung Baek", "Frank DiMaio", "Ivan Anishchenko", "Justas Dauparas", "Sergey Ovchinnikov", "Gyu Rie Lee"],
    year: 2021,
    venue: "Science 2021",
    url: "https://www.science.org/doi/10.1126/science.abj8754",
    question: "How do the same ideas look in a different architecture, and what does it take to extend them to complexes?",
    concept:
      "Three tracks (sequence, residue pairs, and 3D coordinates) that exchange information with each other, so each refines the others.",
    prerequisites: ["AlphaFold 2 (the previous entry)"],
    bioConnection:
      "The paper also predicts protein-protein complexes, and RoseTTAFold later becomes the network that RFdiffusion is built from.",
    exercise: "Read the three tracks side by side with AlphaFold 2's modules and list what each architecture does differently.",
    topics: ["proteins", "graphs"],
    unit: "Structure prediction",
    sessionDate: "2026-12-13",
    status: "scheduled",
  },
  {
    id: "alphafold3",
    title: "Accurate structure prediction of biomolecular interactions with AlphaFold 3",
    authors: ["Josh Abramson", "Jonas Adler", "Jack Dunger", "Richard Evans", "Tim Green", "Alexander Pritzel"],
    year: 2024,
    venue: "Nature 2024",
    url: "https://www.nature.com/articles/s41586-024-07487-w",
    question: "What does it take to predict a protein together with the molecules it binds?",
    concept:
      "A diffusion-based architecture that predicts the joint structure of complexes containing proteins, nucleic acids, small molecules, ions, and modified residues.",
    prerequisites: ["AlphaFold 2", "Denoising Diffusion Probabilistic Models (earlier in this roadmap)"],
    bioConnection:
      "Most biology happens through interactions, so predicting a complex is closer to the question a biologist actually asks.",
    exercise: "Trace how a diffusion step here differs from the image case we read in DDPM.",
    topics: ["proteins", "generative-models", "graphs"],
    unit: "Structure prediction",
    sessionDate: "2026-12-20",
    status: "scheduled",
  },
  {
    id: "proteinmpnn",
    title: "Robust deep learning-based protein sequence design using ProteinMPNN",
    authors: ["Justas Dauparas", "Ivan Anishchenko", "Nathaniel Bennett", "Hua Bai", "Robert J. Ragotte", "Lukas F. Milles"],
    year: 2022,
    venue: "Science 2022",
    url: "https://www.science.org/doi/10.1126/science.add2187",
    question: "Given a backbone shape, which amino acid sequence will actually fold into it?",
    concept:
      "A message-passing network over the backbone graph that predicts a sequence for a given structure, the inverse of the structure prediction problem.",
    prerequisites: ["Graph neural networks (earlier in this roadmap)", "Basics of protein structure"],
    bioConnection:
      "This is the step that turns a designed backbone into something that can be ordered and expressed in a lab.",
    exercise: "Design sequences for one backbone and compare the model's choices at buried versus surface positions.",
    topics: ["proteins", "graphs", "generative-models"],
    unit: "Protein design",
    sessionDate: "2026-12-27",
    status: "scheduled",
  },
  {
    id: "rfdiffusion",
    title: "De novo design of protein structure and function with RFdiffusion",
    authors: ["Joseph L. Watson", "David Juergens", "Nathaniel R. Bennett", "Brian L. Trippe", "Jason Yim"],
    year: 2023,
    venue: "Nature 2023",
    url: "https://www.nature.com/articles/s41586-023-06415-8",
    question: "Can a diffusion model design proteins that work when they are made in a lab?",
    concept:
      "RoseTTAFold fine-tuned to act as the denoiser in a diffusion process over protein backbones, for tasks such as binder design and scaffolding a functional motif.",
    prerequisites: ["Denoising Diffusion Probabilistic Models", "RoseTTAFold", "ProteinMPNN (the previous entry)"],
    bioConnection:
      "The paper reports experimental validation, including a cryo-EM structure of a designed binder that matched the design model.",
    exercise: "Follow one design end to end on paper: backbone from RFdiffusion, sequence from ProteinMPNN, then a structure prediction check.",
    topics: ["proteins", "generative-models"],
    unit: "Protein design",
    sessionDate: "2027-01-03",
    status: "scheduled",
  },
  {
    id: "chai2",
    title: "Zero-shot antibody design in a 24-well plate",
    authors: ["Chai Discovery Team"],
    year: 2025,
    venue: "bioRxiv preprint, not peer reviewed",
    url: "https://www.biorxiv.org/content/10.1101/2025.07.05.663018v1",
    question: "How close is de novo antibody design to being useful, and how should we read a result like this?",
    concept:
      "A generative model used to design antibodies and nanobodies against targets with no known binder, with the designs tested directly in the lab.",
    prerequisites: ["RFdiffusion (the previous entry)", "What an antibody is and how binding is measured"],
    bioConnection:
      "The report describes a 16% hit rate across 52 targets, with at least one hit for half of them. A preprint, so the claims have not been peer reviewed.",
    exercise: "Work out what the reported hit rate does and does not tell us, and what an independent replication would need to measure.",
    topics: ["proteins", "generative-models"],
    unit: "Protein design",
    sessionDate: "2027-01-10",
    status: "scheduled",
  },
];
