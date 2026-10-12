---
title: "Reading BERT: Why Context on Both Sides Matters"
description: "Notes on the first ML × Bio Reading Club paper: how BERT learns from unlabeled text by filling in hidden words, why it helps to see context on both sides of a word, and what that might mean for biomedical text."
date: 2026-10-11
tags: [representation-learning, sequences, ml]
series: ml-bio-reading-club
paperId: bert
paperTitle: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"
paperUrl: "https://arxiv.org/abs/1810.04805"
paperAuthors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova"
---

<div class="callout" role="note">

*Written from my personal reading notes and discussions with friends, with the assistance of Claude.*

</div>

I'm learning machine learning by reading the papers that shaped the field, and this post documents my thoughts and understanding of BERT, the first paper on the [reading club roadmap](/reading-club). BERT (Bidirectional Encoder Representations from Transformers) is by Jacob Devlin, Ming-Wei Chang, Kenton Lee and Kristina Toutanova at Google, published at NAACL 2019. Its central idea: **pretrain a Transformer encoder on unlabeled text by having it fill in hidden words using context on both sides, then fine-tune that one model into strong models for many different tasks.** Ideas, quotes and results belong to the authors cited.

## The problem BERT was answering

By 2018, models pretrained on large amounts of text were known to help with tasks that had little labeled data. Devlin et al. describe two ways to reuse such a model:

- **Feature-based:** freeze the pretrained model and feed its internal representations, as features, into a separately trained task model. ELMo (Peters et al., 2018) is the main example.
- **Fine-tuning:** start from the pretrained weights, add a small prediction layer, and update everything on the task's labels. The original GPT (Radford et al., 2018) is the main example.

BERT can be used either way, though the paper's headline results come from fine-tuning. BERT's pretraining needs no human labels: its targets come from the text itself. Today that's usually called *self-supervised*; the paper uses the then-standard term "unsupervised."

## Why context after a word matters

> The bank beside the river flooded.

A model trained to predict the next word builds each word's representation from that word and the words before it. This is called *causal* attention. At "bank," that representation can use "The bank" but not "beside the river," the words that say which kind of bank this is. A bidirectional encoder lets every position attend to every other position, so "bank" can be shaped by "beside the river" from the first layer on.

<figure class="diagram" id="fig-attention">
<svg viewBox="0 0 400 398" role="img" aria-labelledby="fig-attention-title fig-attention-desc">
<title id="fig-attention-title">Which words can shape the representation of “bank”</title>
<desc id="fig-attention-desc">Two panels for the sentence “The bank beside the river flooded.” Arrows show attention access: which tokens can send information into the vector for “bank.” In the causal panel, only “The” and “bank” have arrows; “beside the river flooded” is greyed out as not yet usable at that position. In the bidirectional panel, all six tokens have arrows, and “beside the river” is highlighted as the later context that says which kind of bank is meant.</desc>
<defs><marker id="fig-attention-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-attention-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<g transform="translate(0 0)">
<text x="10" y="20" class="dg-h" font-size="15">Causal (left-to-right) attention</text>
<rect x="29" y="36" width="150" height="34" rx="8" class="dg-a"/>
<text x="104" y="58" class="dg-t" font-size="14" text-anchor="middle">vector for “bank”</text>
<path d="M40 118L88 75" class="dg-l" marker-end="url(#fig-attention-arr)"/>
<rect x="11" y="120" width="58" height="34" rx="6" class="dg-b"/>
<text x="40" y="142" class="dg-t" font-size="14" text-anchor="middle">The</text>
<path d="M104 118L104 75" class="dg-l" marker-end="url(#fig-attention-arr)"/>
<rect x="75" y="120" width="58" height="34" rx="6" class="dg-b"/>
<text x="104" y="142" class="dg-t" font-size="14" text-anchor="middle">bank</text>
<rect x="139" y="120" width="58" height="34" rx="6" class="dg-off"/>
<text x="168" y="142" class="dg-m" font-size="14" text-anchor="middle">beside</text>
<rect x="203" y="120" width="58" height="34" rx="6" class="dg-off"/>
<text x="232" y="142" class="dg-m" font-size="14" text-anchor="middle">the</text>
<rect x="267" y="120" width="58" height="34" rx="6" class="dg-off"/>
<text x="296" y="142" class="dg-m" font-size="14" text-anchor="middle">river</text>
<rect x="331" y="120" width="58" height="34" rx="6" class="dg-off"/>
<text x="360" y="142" class="dg-m" font-size="14" text-anchor="middle">flooded</text>
<path d="M139 162v6H389v-6" class="dg-ld"/>
<text x="264" y="186" class="dg-m" font-size="13" text-anchor="middle">not yet usable at this position</text>
</g>
<path d="M10 204H390" class="dg-ld"/>
<g transform="translate(0 210)">
<text x="10" y="20" class="dg-h" font-size="15">Bidirectional attention (BERT)</text>
<rect x="29" y="36" width="150" height="34" rx="8" class="dg-a"/>
<text x="104" y="58" class="dg-t" font-size="14" text-anchor="middle">vector for “bank”</text>
<path d="M40 118L88 75" class="dg-l" marker-end="url(#fig-attention-arr)"/>
<rect x="11" y="120" width="58" height="34" rx="6" class="dg-b"/>
<text x="40" y="142" class="dg-t" font-size="14" text-anchor="middle">The</text>
<path d="M104 118L104 75" class="dg-l" marker-end="url(#fig-attention-arr)"/>
<rect x="75" y="120" width="58" height="34" rx="6" class="dg-b"/>
<text x="104" y="142" class="dg-t" font-size="14" text-anchor="middle">bank</text>
<path d="M168 118L120 75" class="dg-la" marker-end="url(#fig-attention-arr-a)"/>
<rect x="139" y="120" width="58" height="34" rx="6" class="dg-a"/>
<text x="168" y="142" class="dg-t" font-size="14" text-anchor="middle">beside</text>
<path d="M232 118L136 75" class="dg-la" marker-end="url(#fig-attention-arr-a)"/>
<rect x="203" y="120" width="58" height="34" rx="6" class="dg-a"/>
<text x="232" y="142" class="dg-t" font-size="14" text-anchor="middle">the</text>
<path d="M296 118L152 75" class="dg-la" marker-end="url(#fig-attention-arr-a)"/>
<rect x="267" y="120" width="58" height="34" rx="6" class="dg-a"/>
<text x="296" y="142" class="dg-t" font-size="14" text-anchor="middle">river</text>
<path d="M360 118L168 75" class="dg-l" marker-end="url(#fig-attention-arr)"/>
<rect x="331" y="120" width="58" height="34" rx="6" class="dg-b"/>
<text x="360" y="142" class="dg-t" font-size="14" text-anchor="middle">flooded</text>
<path d="M139 162v6H325v-6" class="dg-la"/>
<text x="232" y="186" class="dg-t" font-size="13" text-anchor="middle">later words that say which bank</text>
</g>
</svg>
<figcaption><strong>Figure 1. Which words can shape the vector for “bank.”</strong> Arrows mean attention access: information can flow from that token into the representation at “bank.” A causal model’s representation at “bank” can’t use the words after it. BERT’s can, so “beside the river” can resolve the ambiguity from the first layer on. Both models see only the input sentence; nothing here involves generating text.</figcaption>
</figure>

This matters most when a prediction is made *at a specific position*. Given "The bank beside the river flooded, while the bank downtown remained open" and the question "Which bank flooded?", an extractive question-answering model has to point at the right "bank," which is easier if each vector already carries the words that follow it. Likewise, in "She went to the bank to deposit a check," the words after "bank" pull it toward its financial sense.

 A causal model that has read the whole passage can still answer the question. The point is only that its representation *at an early token* can't use what comes after. That makes the difference largest for **token-level tasks** (is this word part of a gene name? does the answer start here?), and smaller for **sentence-level tasks** that judge a whole text or text pair. Causal attention suits generating text, where the next word doesn't exist yet. For analyzing text that's already there, there's no reason to hide the right side.

"Deep" adds one more thing: in every one of BERT's stacked layers, each position attends to both sides, so left and right context keep interacting. ELMo instead trains separate forward and backward LSTM language models (sharing only their token representation and softmax layers) and combines their outputs.

<div class="callout" role="note">

**What "bidirectional" does not mean.** BERT doesn't read the text twice, forward then backward. It processes every position in parallel, and "both sides" refers only to the input it was given. It isn't generating text, so there's no future text to see.

</div>

## How text gets into BERT

BERT's backbone is the Transformer encoder from Vaswani et al. (2017). Text reaches it in three steps.

**Tokens.** BERT uses WordPiece, a subword tokenizer with a 30,000-token vocabulary. The paper's own example is `playing → play + ##ing`, where `##` means "attach to the previous piece." Splits depend on the vocabulary, so a drug or gene name might break into several pieces. I treat "aspirin" as one token below for simplicity.

**Special tokens.** Every input starts with `[CLS]`, and `[SEP]` ends each segment:

`[CLS] The cells survived. [SEP]`\
`[CLS] Which drug was used? [SEP] The cells received aspirin. [SEP]`

The paper notes that a segment can be any span of text, not just one grammatical sentence. The final vector at `[CLS]` serves as a summary of the input for classification.

**Embeddings.** Each token's input vector is the sum of three learned vectors of the same length:

$$
\begin{aligned}
\text{input vector} = {} & \text{token embedding} \\
{} + {} & \text{segment embedding} \\
{} + {} & \text{position embedding}
\end{aligned}
$$

The token embedding says which token it is, the segment embedding says whether it belongs to segment A or B, and the position embedding supplies word order, which attention alone lacks.

<figure class="diagram" id="fig-input">
<svg viewBox="0 0 400 392" role="img" aria-labelledby="fig-input-title fig-input-desc">
<title id="fig-input-title">How a sentence pair becomes BERT’s input</title>
<desc id="fig-input-desc">Thirteen rows, one per token of “[CLS] Which drug was used? [SEP] The cells received aspirin. [SEP]”. For each token, a token embedding, a segment embedding (A for the question and its [SEP], B for the passage and its [SEP]) and a position embedding numbered 0 to 12 are added together. Each summed vector enters a stack of L encoder layers, which produces one output vector per position: C at [CLS] and T1 to T12 for the rest.</desc>
<defs><marker id="fig-input-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-input-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="54" y="22" class="dg-h" font-size="13" text-anchor="middle">Token</text>
<text x="143" y="22" class="dg-h" font-size="13" text-anchor="middle">Segment</text>
<text x="209" y="22" class="dg-h" font-size="13" text-anchor="middle">Position</text>
<text x="301" y="22" class="dg-h" font-size="13" text-anchor="middle">Encoder</text>
<text x="374" y="22" class="dg-h" font-size="13" text-anchor="middle">Output</text>
<text x="54" y="40" class="dg-m" font-size="12" text-anchor="middle">embedding</text>
<text x="143" y="40" class="dg-m" font-size="12" text-anchor="middle">embedding</text>
<text x="209" y="40" class="dg-m" font-size="12" text-anchor="middle">embedding</text>
<text x="301" y="40" class="dg-m" font-size="12" text-anchor="middle">layers 1 to L</text>
<text x="374" y="40" class="dg-m" font-size="12" text-anchor="middle">vectors</text>
<rect x="262" y="54" width="78" height="327" rx="8" class="dg-b"/>
<rect x="268" y="60" width="16" height="315" rx="4" class="dg-a"/>
<rect x="288" y="60" width="16" height="315" rx="4" class="dg-a"/>
<rect x="318" y="60" width="16" height="315" rx="4" class="dg-a"/>
<text x="311" y="221.5" class="dg-t" font-size="14" text-anchor="middle">…</text>
<rect x="8" y="58" width="92" height="20" rx="5" class="dg-a"/>
<text x="54" y="72.5" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[CLS]</text>
<text x="110" y="72.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="58" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="72.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="72.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="58" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="72.5" class="dg-t" font-size="13" text-anchor="middle">0</text>
<path d="M236 68L260 68" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="72.5" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">C</text>
<rect x="8" y="83" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="97.5" class="dg-t" font-size="13" text-anchor="middle">Which</text>
<text x="110" y="97.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="83" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="97.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="97.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="83" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="97.5" class="dg-t" font-size="13" text-anchor="middle">1</text>
<path d="M236 93L260 93" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="97.5" class="dg-t" font-size="13" text-anchor="middle">T1</text>
<rect x="8" y="108" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="122.5" class="dg-t" font-size="13" text-anchor="middle">drug</text>
<text x="110" y="122.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="108" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="122.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="122.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="108" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="122.5" class="dg-t" font-size="13" text-anchor="middle">2</text>
<path d="M236 118L260 118" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="122.5" class="dg-t" font-size="13" text-anchor="middle">T2</text>
<rect x="8" y="133" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="147.5" class="dg-t" font-size="13" text-anchor="middle">was</text>
<text x="110" y="147.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="133" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="147.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="147.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="133" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="147.5" class="dg-t" font-size="13" text-anchor="middle">3</text>
<path d="M236 143L260 143" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="147.5" class="dg-t" font-size="13" text-anchor="middle">T3</text>
<rect x="8" y="158" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="172.5" class="dg-t" font-size="13" text-anchor="middle">used</text>
<text x="110" y="172.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="158" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="172.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="172.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="158" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="172.5" class="dg-t" font-size="13" text-anchor="middle">4</text>
<path d="M236 168L260 168" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="172.5" class="dg-t" font-size="13" text-anchor="middle">T4</text>
<rect x="8" y="183" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="197.5" class="dg-t" font-size="13" text-anchor="middle">?</text>
<text x="110" y="197.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="183" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="197.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="197.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="183" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="197.5" class="dg-t" font-size="13" text-anchor="middle">5</text>
<path d="M236 193L260 193" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="197.5" class="dg-t" font-size="13" text-anchor="middle">T5</text>
<rect x="8" y="208" width="92" height="20" rx="5" class="dg-a"/>
<text x="54" y="222.5" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[SEP]</text>
<text x="110" y="222.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="208" width="46" height="20" rx="5" class="dg-a"/>
<text x="143" y="222.5" class="dg-t" font-size="13" text-anchor="middle">A</text>
<text x="176" y="222.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="208" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="222.5" class="dg-t" font-size="13" text-anchor="middle">6</text>
<path d="M236 218L260 218" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="222.5" class="dg-t" font-size="13" text-anchor="middle">T6</text>
<rect x="8" y="233" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="247.5" class="dg-t" font-size="13" text-anchor="middle">The</text>
<text x="110" y="247.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="233" width="46" height="20" rx="5" class="dg-w"/>
<text x="143" y="247.5" class="dg-t" font-size="13" text-anchor="middle">B</text>
<text x="176" y="247.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="233" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="247.5" class="dg-t" font-size="13" text-anchor="middle">7</text>
<path d="M236 243L260 243" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="247.5" class="dg-t" font-size="13" text-anchor="middle">T7</text>
<rect x="8" y="258" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="272.5" class="dg-t" font-size="13" text-anchor="middle">cells</text>
<text x="110" y="272.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="258" width="46" height="20" rx="5" class="dg-w"/>
<text x="143" y="272.5" class="dg-t" font-size="13" text-anchor="middle">B</text>
<text x="176" y="272.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="258" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="272.5" class="dg-t" font-size="13" text-anchor="middle">8</text>
<path d="M236 268L260 268" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="272.5" class="dg-t" font-size="13" text-anchor="middle">T8</text>
<rect x="8" y="283" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="297.5" class="dg-t" font-size="13" text-anchor="middle">received</text>
<text x="110" y="297.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="283" width="46" height="20" rx="5" class="dg-w"/>
<text x="143" y="297.5" class="dg-t" font-size="13" text-anchor="middle">B</text>
<text x="176" y="297.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="283" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="297.5" class="dg-t" font-size="13" text-anchor="middle">9</text>
<path d="M236 293L260 293" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="297.5" class="dg-t" font-size="13" text-anchor="middle">T9</text>
<rect x="8" y="308" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="322.5" class="dg-t" font-size="13" text-anchor="middle">aspirin</text>
<text x="110" y="322.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="308" width="46" height="20" rx="5" class="dg-w"/>
<text x="143" y="322.5" class="dg-t" font-size="13" text-anchor="middle">B</text>
<text x="176" y="322.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="308" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="322.5" class="dg-t" font-size="13" text-anchor="middle">10</text>
<path d="M236 318L260 318" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="322.5" class="dg-t" font-size="13" text-anchor="middle">T10</text>
<rect x="8" y="333" width="92" height="20" rx="5" class="dg-b"/>
<text x="54" y="347.5" class="dg-t" font-size="13" text-anchor="middle">.</text>
<text x="110" y="347.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="333" width="46" height="20" rx="5" class="dg-w"/>
<text x="143" y="347.5" class="dg-t" font-size="13" text-anchor="middle">B</text>
<text x="176" y="347.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="333" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="347.5" class="dg-t" font-size="13" text-anchor="middle">11</text>
<path d="M236 343L260 343" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="347.5" class="dg-t" font-size="13" text-anchor="middle">T11</text>
<rect x="8" y="358" width="92" height="20" rx="5" class="dg-a"/>
<text x="54" y="372.5" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[SEP]</text>
<text x="110" y="372.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="120" y="358" width="46" height="20" rx="5" class="dg-w"/>
<text x="143" y="372.5" class="dg-t" font-size="13" text-anchor="middle">B</text>
<text x="176" y="372.5" class="dg-m" font-size="14" text-anchor="middle">+</text>
<rect x="186" y="358" width="46" height="20" rx="5" class="dg-b"/>
<text x="209" y="372.5" class="dg-t" font-size="13" text-anchor="middle">12</text>
<path d="M236 368L260 368" class="dg-l" marker-end="url(#fig-input-arr)"/>
<text x="374" y="372.5" class="dg-t" font-size="13" text-anchor="middle">T12</text>
</svg>
<figcaption><strong>Figure 2. Building the input.</strong> Each row is one token. Its token, segment and position embeddings are vectors of the same length H, and they’re added together before entering the encoder. Segment A covers <code>[CLS]</code>, the question and the first <code>[SEP]</code>; segment B covers the passage and the final <code>[SEP]</code>. The output at <code>[CLS]</code> is called C and is used for classification. Adapted from Figure 2 of Devlin et al. (2019).</figcaption>
</figure>

Model size is described by **L** (encoder layers), **H** (hidden size, the length of each token vector) and **A** (attention heads per layer). Heads can learn to track different relationships, but nothing assigns their roles in advance.

| Model | L | H | A | Parameters |
| --- | --- | --- | --- | --- |
| BERT Base | 12 | 768 | 12 | 110M |
| BERT Large | 24 | 1024 | 16 | 340M |

BERT Base was sized to match the original GPT; the authors note the two architectures differ mainly in attention masking.

## Masked language modeling: learning by filling in blanks

> The scientist added [MASK] to the cells to inhibit bacterial growth.

"Antibiotics" is a good guess, and getting there takes context from both sides. That's the intuition behind masked language modeling (MLM), which the paper connects to the classic cloze task. One detail matters: **the target is the token originally in the text**, not any word that would fit.

Why mask at all? If every position can see every other position and the model must predict visible words, it can just copy them. The part I had to slow down for: blocking a position from attending to itself isn't enough, because in a multi-layer model the information can route through neighboring positions. The paper describes each word being able to "see itself" indirectly. Masking removes the answer from the input entirely.

Here's one training example. The original sentence "The scientist treated the cells with aspirin" becomes "The scientist treated the cells with [MASK]." The encoder processes the whole sequence, and the final vector at the `[MASK]` position feeds a prediction head that assigns a probability to every token in the vocabulary.

<figure class="diagram" id="fig-mlm">
<svg viewBox="0 0 400 506" role="img" aria-labelledby="fig-mlm-title fig-mlm-desc">
<title id="fig-mlm-title">One masked language modeling training example</title>
<desc id="fig-mlm-desc">The original text “the scientist treated the cells with aspirin” has the position of “aspirin” selected and replaced by [MASK] in the corrupted input. The corrupted sequence passes through the bidirectional BERT encoder. The final vector at the [MASK] position goes to a prediction head with a softmax over the vocabulary. Illustrative, invented probabilities: aspirin 0.60, penicillin 0.25, glucose 0.10, all other tokens 0.05. The target is the original token, aspirin, and the loss is minus log 0.60, about 0.51.</desc>
<defs><marker id="fig-mlm-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-mlm-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="10" y="18" class="dg-h" font-size="13">Original text</text>
<text x="10" y="47" class="dg-t" font-size="14">the scientist treated the cells with</text>
<rect x="266" y="28" width="76" height="28" rx="6" class="dg-a"/>
<text x="304" y="47" class="dg-t" font-size="14" text-anchor="middle" font-weight="700">aspirin</text>
<path d="M304 60L304 116" class="dg-l" marker-end="url(#fig-mlm-arr)"/>
<text x="294" y="82" class="dg-m" font-size="12.5" text-anchor="end">position selected for prediction,</text>
<text x="294" y="98" class="dg-m" font-size="12.5" text-anchor="end">then replaced with [MASK] here</text>
<text x="10" y="112" class="dg-h" font-size="13">Corrupted input</text>
<text x="10" y="141" class="dg-t" font-size="14">the scientist treated the cells with</text>
<rect x="266" y="122" width="76" height="28" rx="6" class="dg-w dg-dash"/>
<text x="304" y="141" class="dg-t" font-size="14" text-anchor="middle" font-weight="700">[MASK]</text>
<path d="M304 152L304 180" class="dg-l" marker-end="url(#fig-mlm-arr)"/>
<rect x="10" y="182" width="380" height="46" rx="8" class="dg-b"/>
<text x="200" y="210" class="dg-t" font-size="14" text-anchor="middle">BERT encoder: L bidirectional layers</text>
<path d="M304 230L304 262" class="dg-l" marker-end="url(#fig-mlm-arr)"/>
<text x="294" y="251" class="dg-m" font-size="12.5" text-anchor="end">final vector at the [MASK] position</text>
<rect x="10" y="264" width="380" height="40" rx="8" class="dg-b"/>
<text x="200" y="289" class="dg-t" font-size="14" text-anchor="middle">Prediction head: softmax over the vocabulary</text>
<text x="10" y="330" class="dg-m" font-size="12.5">Illustrative probabilities (invented, not model output)</text>
<text x="116" y="355.5" class="dg-h" font-size="13" text-anchor="end">aspirin</text>
<rect x="124" y="342" width="138" height="18" rx="3" class="dg-bar-a"/>
<text x="268" y="355.5" class="dg-t" font-size="13">0.60</text>
<text x="116" y="379.5" class="dg-t" font-size="13" text-anchor="end">penicillin</text>
<rect x="124" y="366" width="57.5" height="18" rx="3" class="dg-bar"/>
<text x="187.5" y="379.5" class="dg-t" font-size="13">0.25</text>
<text x="116" y="403.5" class="dg-t" font-size="13" text-anchor="end">glucose</text>
<rect x="124" y="390" width="23" height="18" rx="3" class="dg-bar"/>
<text x="153" y="403.5" class="dg-t" font-size="13">0.10</text>
<text x="116" y="427.5" class="dg-t" font-size="13" text-anchor="end">all others</text>
<rect x="124" y="414" width="11.5" height="18" rx="3" class="dg-bar"/>
<text x="141.5" y="427.5" class="dg-t" font-size="13">0.05</text>
<rect x="10" y="446" width="380" height="54" rx="8" class="dg-a"/>
<text x="200" y="468" class="dg-h" font-size="14" text-anchor="middle">Target: “aspirin”, the original token</text>
<text x="200" y="489" class="dg-t" font-size="14" text-anchor="middle">loss = −log P(aspirin) = −log 0.60 ≈ 0.51</text>
</svg>
<figcaption><strong>Figure 3. One masked position, start to finish.</strong> The dashed warm box marks what the model sees (the corrupted input). The solid green boxes mark what it’s trained to recover (the original token). The probabilities are invented for illustration, and “aspirin” is treated as a single token for simplicity.</figcaption>
</figure>

The loss is the negative log probability of the original token:

$$
\text{loss} = -\log P(\text{aspirin})
$$

With the illustrative 0.60 from the figure, that's about 0.51. At 0.95 it would be about 0.05; at 0.01, about 4.6. The loss is computed **only at the selected positions**; the others supply context but aren't scored.

### The 80/10/10 recipe

Devlin et al. select 15% of token positions for prediction, and a selected position isn't always masked:

| Treatment | Share of selected positions | Share of all positions |
| --- | --- | --- |
| Replace with `[MASK]` | 80% | 12% |
| Replace with a random token | 10% | 1.5% |
| Leave unchanged | 10% | 1.5% |

In every case the target is still the original: `[MASK]` → aspirin, banana → aspirin, aspirin → aspirin.

The reason is a mismatch: `[MASK]` never appears in the real text BERT sees after pretraining. Mixing in random and unchanged tokens means the model can't tell which positions it will be tested on, so, as the authors argue, it has to keep a good representation of every token. These percentages hold on average across the training data, not exactly within each short sentence.

## Next sentence prediction

MLM is about relationships between tokens, but many tasks depend on relationships between two pieces of text. Next sentence prediction (NSP) targets that. Half the time, segment B is the text that actually followed segment A in the source; the other half, it's a random segment from the corpus. A small classifier on the `[CLS]` vector predicts which:

> A: The scientist treated the cells with aspirin.\
> B: Cell survival was measured the next morning.\
> Label: `IsNext` (assuming B really came next in the source)

> A: The scientist treated the cells with aspirin.\
> B: The train arrived at the station.\
> Label: `NotNext`

<div class="callout" role="note">

**The label comes from sampling, not meaning.** A random segment that happens to be about cell culture is still `NotNext`. NSP is a stand-in for coherence, not a measure of it.

</div>

MLM and NSP train the same encoder at the same time, and the pretraining loss is their sum.

<figure class="diagram" id="fig-shared">
<svg viewBox="0 0 400 366" role="img" aria-labelledby="fig-shared-title fig-shared-desc">
<title id="fig-shared-title">Masked language modeling and next sentence prediction share one encoder</title>
<desc id="fig-shared-desc">A paired input of [CLS], segment A tokens, a [MASK] token, [SEP], segment B tokens and a final [SEP] enters one shared BERT encoder. The output vector C at [CLS] goes to the next sentence prediction head, which predicts IsNext or NotNext. The output vector T at the masked position goes to the masked language modeling head, which predicts the original token. The pretraining loss is the sum of the MLM loss and the NSP loss.</desc>
<defs><marker id="fig-shared-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-shared-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="10" y="18" class="dg-h" font-size="13">Input: segment A and segment B, with a masked position</text>
<rect x="8" y="30" width="52" height="28" rx="6" class="dg-a"/>
<text x="34" y="49" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[CLS]</text>
<path d="M34 60L34 88" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="66" y="30" width="74" height="28" rx="6" class="dg-b"/>
<text x="103" y="49" class="dg-t" font-size="13" text-anchor="middle">A tokens</text>
<path d="M103 60L103 88" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="146" y="30" width="60" height="28" rx="6" class="dg-w dg-dash"/>
<text x="176" y="49" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[MASK]</text>
<path d="M176 60L176 88" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="212" y="30" width="50" height="28" rx="6" class="dg-a"/>
<text x="237" y="49" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[SEP]</text>
<path d="M237 60L237 88" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="268" y="30" width="74" height="28" rx="6" class="dg-b"/>
<text x="305" y="49" class="dg-t" font-size="13" text-anchor="middle">B tokens</text>
<path d="M305 60L305 88" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="348" y="30" width="44" height="28" rx="6" class="dg-a"/>
<text x="370" y="49" class="dg-t" font-size="13" text-anchor="middle" font-weight="700">[SEP]</text>
<path d="M370 60L370 88" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="8" y="90" width="384" height="56" rx="8" class="dg-b"/>
<text x="200" y="114" class="dg-h" font-size="14" text-anchor="middle">One shared BERT encoder</text>
<text x="200" y="134" class="dg-m" font-size="12.5" text-anchor="middle">the same parameters serve both objectives</text>
<path d="M34 148L34 172" class="dg-la" marker-end="url(#fig-shared-arr-a)"/>
<path d="M176 148L176 172" class="dg-la" marker-end="url(#fig-shared-arr-a)"/>
<rect x="14" y="174" width="40" height="26" rx="6" class="dg-a"/>
<text x="34" y="192" class="dg-t" font-size="14" text-anchor="middle" font-weight="700">C</text>
<rect x="146" y="174" width="60" height="26" rx="6" class="dg-a"/>
<text x="176" y="192" class="dg-t" font-size="14" text-anchor="middle" font-weight="700">T</text>
<text x="214" y="192" class="dg-m" font-size="12.5">vector at the masked position</text>
<path d="M34 202L34 228" class="dg-la" marker-end="url(#fig-shared-arr-a)"/>
<path d="M176 202L176 228" class="dg-la" marker-end="url(#fig-shared-arr-a)"/>
<rect x="8" y="230" width="140" height="58" rx="8" class="dg-b"/>
<text x="78" y="254" class="dg-h" font-size="14" text-anchor="middle">NSP head</text>
<text x="78" y="274" class="dg-t" font-size="12.5" text-anchor="middle">IsNext or NotNext</text>
<rect x="156" y="230" width="236" height="58" rx="8" class="dg-b"/>
<text x="274" y="254" class="dg-h" font-size="14" text-anchor="middle">MLM head</text>
<text x="274" y="274" class="dg-t" font-size="12.5" text-anchor="middle">predict the original token</text>
<path d="M78 290L78 318" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<path d="M274 290L274 318" class="dg-l" marker-end="url(#fig-shared-arr)"/>
<rect x="8" y="320" width="384" height="40" rx="8" class="dg-a"/>
<text x="200" y="345" class="dg-h" font-size="14" text-anchor="middle">Pretraining loss = MLM loss + NSP loss</text>
</svg>
<figcaption><strong>Figure 4. Two objectives, one encoder.</strong> The same forward pass serves both tasks. The <code>[CLS]</code> vector goes to the NSP classifier, and the vectors at selected positions go to the MLM head. Both losses update the same encoder weights. A real input has many tokens per segment and usually several selected positions; this shows one of each. Adapted from the pretraining panel of Figure 1 in Devlin et al. (2019).</figcaption>
</figure>

The authors report 97 to 98% NSP accuracy, and they add a useful caution: without fine-tuning, the `[CLS]` vector isn't a meaningful sentence representation.

## One checkpoint, many fine-tuned models

Pretraining used BooksCorpus (800 million words) and English Wikipedia (2.5 billion words). Fine-tuning then starts from those weights, adds a small output head, and updates everything on one task's labels. **The same checkpoint initializes separate task models, each fine-tuned independently.** 

<figure class="diagram" id="fig-adapt">
<svg viewBox="0 0 400 470" role="img" aria-labelledby="fig-adapt-title fig-adapt-desc">
<title id="fig-adapt-title">One pretrained checkpoint initializes separate task models</title>
<desc id="fig-adapt-desc">Unlabeled text from BooksCorpus and English Wikipedia is used for self-supervised pretraining with MLM and NSP, producing one pretrained BERT checkpoint. The checkpoint is copied into four separate task models, each with its own head and its own labeled data: sentiment classification, with a [CLS] head predicting positive or negative; gene-name recognition (an illustrative biomedical example), with a per-token head; extractive question answering, with start and end scores per token; and sentence-pair classification, with a [CLS] head predicting a relationship such as entailment or contradiction.</desc>
<defs><marker id="fig-adapt-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-adapt-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<rect x="8" y="6" width="384" height="52" rx="8" class="dg-b"/>
<text x="200" y="28" class="dg-t" font-size="13.5" text-anchor="middle">Unlabeled text: BooksCorpus + English Wikipedia</text>
<text x="200" y="47" class="dg-m" font-size="12.5" text-anchor="middle">self-supervised pretraining with MLM + NSP</text>
<path d="M200 60L200 84" class="dg-l" marker-end="url(#fig-adapt-arr)"/>
<rect x="88" y="86" width="224" height="40" rx="8" class="dg-a"/>
<text x="200" y="111" class="dg-h" font-size="14" text-anchor="middle">Pretrained BERT checkpoint</text>
<path d="M200 128V144H24V427" class="dg-l"/>
<text x="210" y="156" class="dg-m" font-size="12.5">copied into each task model</text>
<path d="M24 199L46 199" class="dg-l" marker-end="url(#fig-adapt-arr)"/>
<rect x="48" y="166" width="344" height="66" rx="8" class="dg-b"/>
<text x="62" y="188" class="dg-h" font-size="13.5">Sentiment classification</text>
<text x="62" y="206" class="dg-t" font-size="12.5">Head: [CLS] → positive or negative</text>
<text x="62" y="223" class="dg-m" font-size="12.5">Fine-tuned on: labeled sentences</text>
<path d="M24 275L46 275" class="dg-l" marker-end="url(#fig-adapt-arr)"/>
<rect x="48" y="242" width="344" height="66" rx="8" class="dg-b"/>
<text x="62" y="264" class="dg-h" font-size="13.5">Gene-name recognition (my example)</text>
<text x="62" y="282" class="dg-t" font-size="12.5">Head: each token → gene or not gene</text>
<text x="62" y="299" class="dg-m" font-size="12.5">Fine-tuned on: sentences with gene labels</text>
<path d="M24 351L46 351" class="dg-l" marker-end="url(#fig-adapt-arr)"/>
<rect x="48" y="318" width="344" height="66" rx="8" class="dg-b"/>
<text x="62" y="340" class="dg-h" font-size="13.5">Extractive question answering</text>
<text x="62" y="358" class="dg-t" font-size="12.5">Head: start and end score per token</text>
<text x="62" y="375" class="dg-m" font-size="12.5">Fine-tuned on: questions, passages, spans</text>
<path d="M24 427L46 427" class="dg-l" marker-end="url(#fig-adapt-arr)"/>
<rect x="48" y="394" width="344" height="66" rx="8" class="dg-b"/>
<text x="62" y="416" class="dg-h" font-size="13.5">Sentence-pair classification</text>
<text x="62" y="434" class="dg-t" font-size="12.5">Head: [CLS] → entailment, contradiction…</text>
<text x="62" y="451" class="dg-m" font-size="12.5">Fine-tuned on: labeled sentence pairs</text>
</svg>
<figcaption><strong>Figure 5. Pretrain once, fine-tune separately.</strong> Each task model starts as a copy of the same checkpoint, adds its own small output head and is fine-tuned on its own labeled data. The four models end up with different weights. Gene-name recognition is my biomedical illustration; the other three task shapes appear in the paper.</figcaption>
</figure>

## What the experiments showed

Devlin et al. report state-of-the-art results on eleven NLP tasks as of 2018. Those scores were soon overtaken, so what interests me is how little each task needed on top of the encoder:

| Benchmark | What fine-tuning adds | Result in the paper |
| --- | --- | --- |
| GLUE: sentence and pair classification | One layer on `[CLS]`: $W \in \mathbb{R}^{K \times H}$ maps $H$ values to $K$ class scores | 80.5, 7.7 points above GPT |
| SQuAD 1.1: extract an answer span | Start and end vectors $S$, $E$ that score each token | 93.2 test F1 (ensemble, after TriviaQA) |
| SQuAD 2.0: answer may be missing | The same, plus a "no answer" option at `[CLS]` | 83.1 test F1 |
| SWAG: pick one of four continuations | One vector that scores each pair's `[CLS]` | 86.3% accuracy, 8.3 points above GPT |

Given "What drug did the researchers use?" and the passage "The researchers treated the cells with aspirin for 24 hours," a SQuAD-style model points at "aspirin" in the passage rather than generating an answer. Asked for a concentration the passage never mentions, a SQuAD 2.0 model can point at `[CLS]`, meaning "no answer."

## What the ablations showed

An ablation removes one part of a system to measure its contribution. Three of the paper's results stood out to me.

- **Bidirectional pretraining mattered most.** Swapping MLM for a left-to-right objective like GPT's, with everything else the same, dropped SQuAD from 87.9 to 77.8 development F1. Adding a bidirectional LSTM on top during fine-tuning recovered only part of that (84.9). In these experiments, learning both-sided context during pretraining beat adding it afterward.
- **Scale helped even with little data.** Larger models improved every task tested, including MRPC, which has about 3,600 labeled examples.
- **Frozen features came close.** Feeding a frozen BERT's top four layers into a separate model for named-entity recognition landed only 0.3 F1 behind full fine-tuning.

<div class="callout" role="note">

**A note on NSP.** Removing NSP hurt some tasks in the paper, most clearly QNLI (88.4 to 84.9). That holds under the paper's conditions, not in general: RoBERTa (Liu et al., 2019) later found that dropping NSP matched or slightly improved results when inputs were built differently.

</div>

## What I take from this as someone interested in biology

The idea I want to carry forward: **a model can learn useful representations by reconstructing hidden information from context, and then reuse them, frozen or fine-tuned, for labeled tasks.** Despite "Language Understanding" in the title, what BERT learns is a set of contextual representations that proved useful on these benchmarks, not a guarantee of human-like understanding.

The most direct connection to my interests is biomedical text. Finding gene or drug mentions is a token-level task, like the paper's named-entity recognition. Sorting papers by topic is sentence-level classification. Answering questions from a given abstract is the SQuAD setup. BioBERT (Lee et al., 2020) took this route, continuing BERT's pretraining on PubMed and PMC text before fine-tuning.

The same reconstruction idea shows up in biological sequence models. ESM (Rives et al., 2021) learns to predict masked amino acids in proteins, and DNABERT (Ji et al., 2021) applies BERT-style pretraining to DNA. Those are separate models trained on sequences. The original BERT models English text, not genes or proteins; what carries over is the objective and the encoder design.

Takeaways:

- **Bidirectional means what each position can see,** and it matters most for token-level predictions.
- **Masking prevents copying,** and the 80/10/10 mix narrows the gap between pretraining and real inputs.
- **Pretraining tasks are stand-ins.** NSP labels come from sampling, and later work dropped NSP without losing performance.
- **Frozen features can be enough:** 0.3 F1 behind fine-tuning in the paper's NER experiment.

Questions I want to explore next:

1. **How do masking choices shape what a model learns?** In proteins and DNA, context can matter far from the masked position. Would masking whole spans or motifs work better than isolated tokens?
2. **When are frozen features enough?** That matters for small labs with small datasets, especially when the text is far from what the model was pretrained on.

## References

- Devlin, J., Chang, M.-W., Lee, K., and Toutanova, K. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. *NAACL*. [arXiv:1810.04805](https://arxiv.org/abs/1810.04805)
- Vaswani, A., Shazeer, N., Parmar, N., et al. (2017). Attention Is All You Need. *NeurIPS*. [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
- Peters, M. E., Neumann, M., Iyyer, M., et al. (2018). Deep Contextualized Word Representations. *NAACL*. [arXiv:1802.05365](https://arxiv.org/abs/1802.05365)
- Radford, A., Narasimhan, K., Salimans, T., and Sutskever, I. (2018). Improving Language Understanding by Generative Pre-Training. OpenAI. [PDF](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- Liu, Y., Ott, M., Goyal, N., et al. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach. [arXiv:1907.11692](https://arxiv.org/abs/1907.11692)
- Lee, J., Yoon, W., Kim, S., et al. (2020). BioBERT: a pre-trained biomedical language representation model for biomedical text mining. *Bioinformatics*. [doi:10.1093/bioinformatics/btz682](https://doi.org/10.1093/bioinformatics/btz682)
- Rives, A., Meier, J., Sercu, T., et al. (2021). Biological structure and function emerge from scaling unsupervised learning to 250 million protein sequences. *PNAS*. [doi:10.1073/pnas.2016239118](https://doi.org/10.1073/pnas.2016239118)
- Ji, Y., Zhou, Z., Liu, H., and Davuluri, R. V. (2021). DNABERT: pre-trained Bidirectional Encoder Representations from Transformers model for DNA-language in genome. *Bioinformatics*. [doi:10.1093/bioinformatics/btab083](https://doi.org/10.1093/bioinformatics/btab083)

For a line-by-line code walkthrough of the original Transformer, see [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) from Harvard NLP (originally by Sasha Rush).
