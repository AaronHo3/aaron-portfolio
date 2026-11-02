---
title: "Reading the Transformer: Attention Is All You Need"
description: "My notes on the Transformer: how self-attention replaced recurrence, what every matrix dimension actually is, and a worked example of attention you can follow by hand."
date: 2026-11-01
draft: false
tags: [sequences, representation-learning, ml]
series: ml-bio-reading-club
paperId: transformer
paperTitle: "Attention Is All You Need"
paperUrl: "https://arxiv.org/abs/1706.03762"
paperAuthors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin"
---

<div class="callout" role="note">

*Written from my own notes and our paper club discussion. Diagrams and light copy editing with the assistance of Claude.*

</div>

Today's paper is on the super popular and heavily cited [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762) by Vaswani et al. (2017).

Originally designed for machine translation, such as English to French, this architecture replaced the recurrent neural networks (RNNs) that were commonly used for sequence-to-sequence tasks.

Let's dive right in.

## The Big Picture

Before Transformers, sequence models commonly used RNNs and LSTMs, which processed tokens *sequentially*. As you might expect, this made training difficult to parallelize across positions. You simply had to go in order and sit there and wait.

Transformers took a different approach by building their architecture around **attention mechanisms**, particularly self-attention.

Self-attention allows every token to attend to other tokens in the sequence. Basically, it's a way of gathering information to figure out how much another token matters or influences the representation of a particular token.

To make this easier to digest, consider this example:

> The animal didn't cross the street because it was tired.

Self-attention allows the representation of "it" to incorporate information from "animal," which helps the model understand their relationship.

Now, the original Transformer paper used an **encoder-decoder architecture**.

<figure class="diagram" id="fig-architecture">
<svg viewBox="0 0 400 404" role="img" aria-labelledby="fig-architecture-t fig-architecture-d">
<title id="fig-architecture-t">The encoder-decoder Transformer</title>
<desc id="fig-architecture-d">On the left, the encoder: input embedding plus positional encoding feeds a stack of six identical layers, each with multi-head self-attention and a feed-forward network, both followed by add and norm. On the right, the decoder: output embedding plus positional encoding, shifted right, feeds six identical layers with masked self-attention, cross-attention and a feed-forward network. An arrow carries the encoder's n by 512 output into every decoder layer's cross-attention. The decoder stack ends in a linear layer and a softmax producing output probabilities.</desc>
<defs><marker id="fig-architecture-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-architecture-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="94" y="16" class="dg-h" font-size="13.5" text-anchor="middle">Encoder</text>
<text x="306" y="16" class="dg-h" font-size="13.5" text-anchor="middle">Decoder</text>
<rect x="10" y="24" width="168" height="150" rx="8" class="dg-a"/>
<rect x="20" y="34" width="148" height="40" rx="6" class="dg-b"/><text x="94" y="53" class="dg-h" font-size="12" text-anchor="middle">Multi-Head</text><text x="94" y="68" class="dg-m" font-size="11" text-anchor="middle">Self-Attention</text>
<text x="94" y="88" class="dg-m" font-size="10.5" text-anchor="middle">Add & Norm</text>
<rect x="20" y="96" width="148" height="36" rx="6" class="dg-b"/><text x="94" y="118.5" class="dg-h" font-size="12" text-anchor="middle">Feed Forward</text>
<text x="94" y="146" class="dg-m" font-size="10.5" text-anchor="middle">Add & Norm</text>
<text x="94" y="165" class="dg-t" font-size="11.5" text-anchor="middle">× 6 layers</text>
<rect x="222" y="24" width="168" height="186" rx="8" class="dg-a"/>
<rect x="232" y="32" width="148" height="36" rx="6" class="dg-b"/><text x="306" y="54.5" class="dg-h" font-size="11.5" text-anchor="middle">Masked Self-Attn</text>
<text x="306" y="80" class="dg-m" font-size="10.5" text-anchor="middle">Add & Norm</text>
<rect x="232" y="88" width="148" height="36" rx="6" class="dg-w"/><text x="306" y="110.5" class="dg-h" font-size="11.5" text-anchor="middle">Cross-Attention</text>
<text x="306" y="136" class="dg-m" font-size="10.5" text-anchor="middle">Add & Norm</text>
<rect x="232" y="144" width="148" height="32" rx="6" class="dg-b"/><text x="306" y="164.5" class="dg-h" font-size="11.5" text-anchor="middle">Feed Forward</text>
<text x="306" y="188" class="dg-m" font-size="10.5" text-anchor="middle">Add & Norm</text>
<text x="306" y="203" class="dg-t" font-size="11.5" text-anchor="middle">× 6 layers</text>
<path d="M178 112H228" class="dg-la" marker-end="url(#fig-architecture-b)"/>
<text x="200" y="104" class="dg-t" font-size="10" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×512</text>
<rect x="10" y="226" width="168" height="34" rx="6" class="dg-b"/><text x="94" y="247.5" class="dg-h" font-size="11.5" text-anchor="middle">Input Embedding + PE</text>
<rect x="222" y="226" width="168" height="34" rx="6" class="dg-b"/><text x="306" y="247.5" class="dg-h" font-size="11.5" text-anchor="middle">Output Embedding + PE</text>
<text x="306" y="276" class="dg-m" font-size="11" text-anchor="middle">(outputs shifted right)</text>
<path d="M94 224L94 178" class="dg-l" marker-end="url(#fig-architecture-a)"/>
<path d="M306 224L306 214" class="dg-l" marker-end="url(#fig-architecture-a)"/>
<path d="M306 22L306 8" class="dg-l" marker-end="url(#fig-architecture-a)"/>
<rect x="244" y="300" width="124" height="30" rx="6" class="dg-b"/><text x="306" y="319.5" class="dg-h" font-size="12" text-anchor="middle">Linear</text>
<rect x="244" y="340" width="124" height="30" rx="6" class="dg-a"/><text x="306" y="359.5" class="dg-h" font-size="12" text-anchor="middle">Softmax</text>
<text x="306" y="390" class="dg-t" font-size="11.5" text-anchor="middle">output probabilities</text>
<path d="M390 8H392V300" class="dg-l"/>
<path d="M392 300L380 300" class="dg-l" marker-end="url(#fig-architecture-a)"/>
<path d="M306 332L306 338" class="dg-l" marker-end="url(#fig-architecture-a)"/>
<path d="M306 372L306 380" class="dg-l" marker-end="url(#fig-architecture-a)"/>
</svg>
<figcaption><strong>Figure 1. The whole architecture.</strong> Redrawn from Figure 1 of Vaswani et al. (2017). The encoder reads the whole input at once; the decoder produces one token at a time and reaches back into the encoder's output through cross-attention.</figcaption>
</figure>

- **Encoder:** Processes the input sequence and produces contextual representations of its tokens.
- **Decoder:** Uses those representations, along with previously generated output tokens, to predict the next token in the translated sentence.

<div class="callout" role="note">

**A note on the dimensions in this post.** Some are chosen by whoever designs the model, and the paper fixes them: $d_\text{model} = 512$, 8 heads, $d_k = d_v = 64$ per head, a feed-forward hidden size of 2048, and 6 layers in each stack. Others are decided by your data: $n$ is how many tokens are in the input, $m$ is how many are in the output so far, and $V$ is the vocabulary size. I use $n$, $m$ and $V$ as symbols throughout so it stays clear which is which.

</div>

## Input Embeddings and Positional Encoding

To understand the flow of information, we can start by looking at the input embeddings and positional encodings, which form the input to the first layer of the encoder stack.

Since neural networks don't process words directly, text is first **tokenized**, with each token assigned an integer ID.

Each ID is then mapped to a learned embedding vector.

<figure class="diagram" id="fig-embedding">
<svg viewBox="0 0 400 304" role="img" aria-labelledby="fig-embedding-t fig-embedding-d">
<title id="fig-embedding-t">From a sentence to a matrix of embeddings</title>
<desc id="fig-embedding-d">The sentence I love cats is tokenized into three tokens, each mapped to an integer id (312, 4820, 991), and each id is looked up in a learned embedding table to produce a vector of 512 numbers. Stacked together the three tokens form a 3 by 512 matrix, or n by 512 in general.</desc>
<defs><marker id="fig-embedding-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-embedding-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="10" y="18" class="dg-h" font-size="13" text-anchor="start">“I love cats”</text>
<text x="10" y="36" class="dg-m" font-size="11.5" text-anchor="start">the sentence we want to translate</text>
<text x="98" y="90" class="dg-m" font-size="11" text-anchor="end">tokenize</text>
<rect x="108" y="70" width="88" height="32" rx="6" class="dg-b"/><text x="152" y="90.5" class="dg-h" font-size="13" text-anchor="middle">I</text>
<rect x="206" y="70" width="88" height="32" rx="6" class="dg-b"/><text x="250" y="90.5" class="dg-h" font-size="13" text-anchor="middle">love</text>
<rect x="304" y="70" width="88" height="32" rx="6" class="dg-b"/><text x="348" y="90.5" class="dg-h" font-size="13" text-anchor="middle">cats</text>
<path d="M152 104L152 124" class="dg-l" marker-end="url(#fig-embedding-a)"/>
<path d="M250 104L250 124" class="dg-l" marker-end="url(#fig-embedding-a)"/>
<path d="M348 104L348 124" class="dg-l" marker-end="url(#fig-embedding-a)"/>
<text x="98" y="146" class="dg-m" font-size="11" text-anchor="end">token id</text>
<rect x="108" y="126" width="88" height="30" rx="6" class="dg-b"/><text x="152" y="145.5" class="dg-h" font-size="12.5" text-anchor="middle">312</text>
<rect x="206" y="126" width="88" height="30" rx="6" class="dg-b"/><text x="250" y="145.5" class="dg-h" font-size="12.5" text-anchor="middle">4820</text>
<rect x="304" y="126" width="88" height="30" rx="6" class="dg-b"/><text x="348" y="145.5" class="dg-h" font-size="12.5" text-anchor="middle">991</text>
<path d="M152 158L152 182" class="dg-la" marker-end="url(#fig-embedding-b)"/>
<path d="M250 158L250 182" class="dg-la" marker-end="url(#fig-embedding-b)"/>
<path d="M348 158L348 182" class="dg-la" marker-end="url(#fig-embedding-b)"/>
<text x="98" y="204" class="dg-t" font-size="11" text-anchor="end">embedding</text><text x="98" y="218" class="dg-t" font-size="11" text-anchor="end">lookup</text>
<rect x="108" y="184" width="88" height="34" rx="5" class="dg-a"/>
<rect x="112" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.30"/>
<rect x="121.2" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.44"/>
<rect x="130.4" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.58"/>
<rect x="139.6" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.72"/>
<rect x="148.8" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.86"/>
<rect x="158" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.30"/>
<rect x="167.2" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.44"/>
<rect x="176.39999999999998" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.58"/>
<rect x="185.6" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.72"/>
<text x="152" y="232" class="dg-m" font-size="11" text-anchor="middle">512 numbers</text>
<rect x="206" y="184" width="88" height="34" rx="5" class="dg-a"/>
<rect x="210" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.72"/>
<rect x="219.2" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.86"/>
<rect x="228.4" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.30"/>
<rect x="237.6" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.44"/>
<rect x="246.8" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.58"/>
<rect x="256" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.72"/>
<rect x="265.2" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.86"/>
<rect x="274.4" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.30"/>
<rect x="283.6" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.44"/>
<text x="250" y="232" class="dg-m" font-size="11" text-anchor="middle">512 numbers</text>
<rect x="304" y="184" width="88" height="34" rx="5" class="dg-a"/>
<rect x="308" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.44"/>
<rect x="317.2" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.58"/>
<rect x="326.4" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.72"/>
<rect x="335.6" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.86"/>
<rect x="344.8" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.30"/>
<rect x="354" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.44"/>
<rect x="363.2" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.58"/>
<rect x="372.4" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.72"/>
<rect x="381.6" y="191" width="7" height="20" rx="2" class="dg-bar-a" opacity="0.86"/>
<text x="348" y="232" class="dg-m" font-size="11" text-anchor="middle">512 numbers</text>
<path d="M24 250H376" class="dg-ld"/>
<text x="200" y="274" class="dg-h" font-size="12.5" text-anchor="middle">3 tokens stacked together: a 3 × 512 matrix</text>
<text x="200" y="292" class="dg-m" font-size="11.5" text-anchor="middle">in general n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512, where n is the sequence length</text>
</svg>
<figcaption><strong>Figure 2. Tokens become vectors.</strong> The embedding table is learned. 512 is a design choice (the paper's <em>d</em><sub>model</sub>); the number of rows is just however many tokens you fed in.</figcaption>
</figure>

In the original Transformer, the embedding dimension was **512**, meaning every token was represented by a vector containing 512 numbers.

Now that we have our token embeddings, we also need **positional encodings** because attention alone does not inherently know the order of the tokens.

In the paper, the authors used sine and cosine functions of different frequencies to encode the positions of tokens:

$$
PE_{(pos,\,2i)} = \sin\!\left(\frac{pos}{10000^{2i/d_\text{model}}}\right), \qquad
PE_{(pos,\,2i+1)} = \cos\!\left(\frac{pos}{10000^{2i/d_\text{model}}}\right)
$$

The positional encoding also has 512 dimensions, allowing it to be added element-wise to the corresponding token embedding.

Therefore:

**INPUT = Token Embedding + Positional Encoding**

For a sequence of $n$ tokens:

- Token embedding matrix: $n \times 512$
- Positional encoding matrix: $n \times 512$
- Final input matrix: $n \times 512$

<figure class="diagram" id="fig-addition">
<svg viewBox="0 0 400 240" role="img" aria-labelledby="fig-addition-t fig-addition-d">
<title id="fig-addition-t">Token embeddings plus positional encodings</title>
<desc id="fig-addition-d">Three matrices of the same shape side by side. The token embedding matrix, n by 512, plus the positional encoding matrix, n by 512, equals the encoder input matrix, n by 512. The addition is element-wise, and the positional encoding comes from fixed sine and cosine functions rather than being learned.</desc>
<defs><marker id="fig-addition-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-addition-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="10" y="18" class="dg-h" font-size="13" text-anchor="start">Adding position information</text>
<rect x="8" y="42" width="104" height="92" rx="6" class="dg-a"/><rect x="16" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="29" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="42" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="55" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="68" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="81" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="94" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="16" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="29" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="42" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="55" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="68" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="81" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="94" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="16" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="29" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="42" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="55" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="68" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="81" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="94" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/>
<text x="60" y="152" class="dg-t" font-size="11.5" text-anchor="middle">token embeddings</text>
<text x="60" y="168" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<text x="136" y="94" class="dg-t" font-size="18" text-anchor="middle">+</text>
<rect x="150" y="42" width="104" height="92" rx="6" class="dg-w"/><rect x="158" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.55"/><rect x="171" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.70"/><rect x="184" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.85"/><rect x="197" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.25"/><rect x="210" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.40"/><rect x="223" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.55"/><rect x="236" y="54" width="10" height="18" rx="2" class="dg-bar" opacity="0.70"/><rect x="158" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.85"/><rect x="171" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.25"/><rect x="184" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.40"/><rect x="197" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.55"/><rect x="210" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.70"/><rect x="223" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.85"/><rect x="236" y="80" width="10" height="18" rx="2" class="dg-bar" opacity="0.25"/><rect x="158" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.40"/><rect x="171" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.55"/><rect x="184" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.70"/><rect x="197" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.85"/><rect x="210" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.25"/><rect x="223" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.40"/><rect x="236" y="106" width="10" height="18" rx="2" class="dg-bar" opacity="0.55"/>
<text x="202" y="152" class="dg-t" font-size="11.5" text-anchor="middle">positional encoding</text>
<text x="202" y="168" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<text x="278" y="94" class="dg-t" font-size="18" text-anchor="middle">=</text>
<rect x="292" y="42" width="104" height="92" rx="6" class="dg-b"/><rect x="300" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="313" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="326" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="339" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="352" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="365" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="378" y="54" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="300" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="313" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="326" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="339" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="352" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="365" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="378" y="80" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="300" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="313" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/><rect x="326" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.55"/><rect x="339" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.70"/><rect x="352" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.85"/><rect x="365" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.25"/><rect x="378" y="106" width="10" height="18" rx="2" class="dg-bar-a" opacity="0.40"/>
<text x="344" y="152" class="dg-t" font-size="11.5" text-anchor="middle">encoder input</text>
<text x="344" y="168" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M8 188H392" class="dg-ld"/>
<text x="200" y="212" class="dg-m" font-size="11.5" text-anchor="middle">Element-wise: same shape in, same shape out.</text>
<text x="200" y="229" class="dg-m" font-size="11.5" text-anchor="middle">The positional encoding is fixed, not learned.</text>
</svg>
<figcaption><strong>Figure 3. Same shape in, same shape out.</strong> Because both matrices are <em>n</em> × 512, they can simply be added. This is how order gets into a model that otherwise has no idea which token came first.</figcaption>
</figure>

## The Encoder

Now that we have our input established, we can follow the route it takes into the encoder.

The original Transformer consists of **six encoder layers with the same architecture**, but for simplicity's sake, we'll just cover one of the layers and explain what's going on inside it.

Each encoder layer has two main sublayers:

### 1. Multi-Head Self-Attention

The self-attention sublayer allows each token to incorporate information from other tokens in the input sequence.

In the paper, the authors use **multi-head attention**, which allows the model to learn different types of relationships between tokens.

Rather than simply stacking more attention blocks, each head uses its own learned projections of the queries, keys, and values. These attention operations run in parallel, and their outputs are combined.

### 2. Feed-Forward Network

The output of the self-attention sublayer then goes into a feed-forward network, which applies nonlinear transformations to each token's representation independently.

In the original Transformer, the FFN:

1. Linearly expands each token representation from 512 to 2048 dimensions.
2. Applies a ReLU activation function to introduce nonlinearity.
3. Projects the representation back down from 2048 to 512 dimensions.

The nonlinear activation is important because it allows the network to learn transformations that couldn't be represented by a single linear transformation.

Each sublayer also uses **residual connections** and **layer normalization**.

- **Residual connections:** Add the sublayer's input back to its output, helping preserve information and improve gradient flow during training.
- **Layer normalization:** Normalizes the features within each token's representation, helping stabilize the activations and training process.

The original Transformer uses the following order:

Sublayer → Residual Addition → Layer Normalization.

<figure class="diagram" id="fig-encoder">
<svg viewBox="0 0 400 390" role="img" aria-labelledby="fig-encoder-t fig-encoder-d">
<title id="fig-encoder-t">One encoder layer with the shape at every stage</title>
<desc id="fig-encoder-d">A vertical flow. The input, n by 512, goes into multi-head self-attention, which outputs n by 512, then add and norm with a residual connection from the input. That result goes into the feed-forward network, which multiplies by W one, 512 by 2048, applies ReLU to give n by 2048, then multiplies by W two, 2048 by 512. Another add and norm with its own residual gives the output, n by 512. The feed-forward network is applied to each token separately.</desc>
<defs><marker id="fig-encoder-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-encoder-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="200" y="18" class="dg-h" font-size="13.5" text-anchor="middle">One encoder layer</text>
<rect x="75" y="28" width="250" height="34" rx="6" class="dg-b"/><text x="200" y="44" class="dg-h" font-size="12" text-anchor="middle">input</text><text x="200" y="59" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M200 64L200 78" class="dg-l" marker-end="url(#fig-encoder-a)"/>
<rect x="75" y="80" width="250" height="38" rx="6" class="dg-a"/><text x="200" y="98" class="dg-h" font-size="12" text-anchor="middle">Multi-Head Self-Attention</text><text x="200" y="113" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512 out</text>
<path d="M200 120L200 134" class="dg-l" marker-end="url(#fig-encoder-a)"/>
<rect x="75" y="136" width="250" height="30" rx="6" class="dg-b"/><text x="200" y="155.5" class="dg-h" font-size="12" text-anchor="middle">Add & Norm</text>
<path d="M75 45H40V151H71" class="dg-la" marker-end="url(#fig-encoder-b)"/>
<text transform="rotate(-90 28 104)" x="28" y="104" class="dg-t" font-size="10.5" text-anchor="middle">residual</text>
<text transform="rotate(-90 28 258)" x="28" y="258" class="dg-t" font-size="10.5" text-anchor="middle">residual</text>
<path d="M200 168L200 182" class="dg-l" marker-end="url(#fig-encoder-a)"/>
<rect x="75" y="184" width="250" height="92" rx="7" class="dg-b"/>
<text x="200" y="202" class="dg-h" font-size="12" text-anchor="middle">Feed-Forward Network</text>
<rect x="87" y="210" width="226" height="26" rx="6" class="dg-w"/><text x="200" y="227.5" class="dg-h" font-size="11" text-anchor="middle">× W<tspan dy="3" font-size="0.72em">1</tspan><tspan dy="-3"></tspan> (512 × 2048) → ReLU</text>
<text x="200" y="250" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 2048</text>
<rect x="87" y="256" width="226" height="24" rx="6" class="dg-w"/><text x="200" y="272.5" class="dg-h" font-size="11" text-anchor="middle">× W<tspan dy="3" font-size="0.72em">2</tspan><tspan dy="-3"></tspan> (2048 × 512)</text>
<path d="M200 284L200 298" class="dg-l" marker-end="url(#fig-encoder-a)"/>
<rect x="75" y="300" width="250" height="30" rx="6" class="dg-b"/><text x="200" y="319.5" class="dg-h" font-size="12" text-anchor="middle">Add & Norm</text>
<path d="M75 199H40V315H71" class="dg-la" marker-end="url(#fig-encoder-b)"/>
<path d="M200 332L200 346" class="dg-l" marker-end="url(#fig-encoder-a)"/>
<rect x="75" y="348" width="250" height="34" rx="6" class="dg-a"/><text x="200" y="364" class="dg-h" font-size="12" text-anchor="middle">output</text><text x="200" y="379" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<text x="363" y="202" class="dg-m" font-size="10" text-anchor="middle">applied to</text>
<text x="363" y="215" class="dg-m" font-size="10" text-anchor="middle">each token</text>
<text x="363" y="228" class="dg-m" font-size="10" text-anchor="middle">separately</text>
</svg>
<figcaption><strong>Figure 4. The shape never changes.</strong> A layer takes <em>n</em> × 512 and returns <em>n</em> × 512, which is exactly why six of them stack. Only inside the feed-forward network does the width briefly grow to 2048.</figcaption>
</figure>

## How Is Self-Attention Actually Calculated?

So I've said "self-attention" a ton of times by now, but how exactly is it calculated?

Every input token is projected into three vectors using learned weight matrices for **Query, Key, and Value**.

- **Query (Q):** What information is this token looking for?
- **Key (K):** What information can this token provide for matching?
- **Value (V):** What information does this token contribute?

<figure class="diagram" id="fig-qkv">
<svg viewBox="0 0 400 268" role="img" aria-labelledby="fig-qkv-t fig-qkv-d">
<title id="fig-qkv-t">Projecting the input into queries, keys and values</title>
<desc id="fig-qkv-d">The input matrix X, n by 512, is multiplied by three separate learned weight matrices, each 512 by 64: W Q gives the queries Q, W K gives the keys K, and W V gives the values V. Each result is n by 64. The shape arithmetic is n by 512 times 512 by 64 equals n by 64, and each of the eight heads has its own three matrices.</desc>
<defs><marker id="fig-qkv-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-qkv-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="200" y="18" class="dg-h" font-size="13.5" text-anchor="middle">One attention head's projections</text>
<rect x="150" y="28" width="100" height="36" rx="6" class="dg-b"/><text x="200" y="45" class="dg-h" font-size="13" text-anchor="middle">X</text><text x="200" y="60" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M200 66C200 86 68 86 68 100" class="dg-l" marker-end="url(#fig-qkv-a)"/>
<rect x="10" y="102" width="116" height="34" rx="6" class="dg-b"/><text x="68" y="118" class="dg-h" font-size="12" text-anchor="middle">× W<tspan dy="3" font-size="0.72em">Q</tspan><tspan dy="-3"></tspan></text><text x="68" y="133" class="dg-m" font-size="11" text-anchor="middle">512 × 64</text>
<path d="M68 138L68 154" class="dg-l" marker-end="url(#fig-qkv-a)"/>
<rect x="10" y="156" width="116" height="38" rx="6" class="dg-a"/><text x="68" y="174" class="dg-h" font-size="14" text-anchor="middle">Q</text><text x="68" y="189" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64</text>
<path d="M200 66C200 86 200 86 200 100" class="dg-l" marker-end="url(#fig-qkv-a)"/>
<rect x="142" y="102" width="116" height="34" rx="6" class="dg-b"/><text x="200" y="118" class="dg-h" font-size="12" text-anchor="middle">× W<tspan dy="3" font-size="0.72em">K</tspan><tspan dy="-3"></tspan></text><text x="200" y="133" class="dg-m" font-size="11" text-anchor="middle">512 × 64</text>
<path d="M200 138L200 154" class="dg-l" marker-end="url(#fig-qkv-a)"/>
<rect x="142" y="156" width="116" height="38" rx="6" class="dg-w"/><text x="200" y="174" class="dg-h" font-size="14" text-anchor="middle">K</text><text x="200" y="189" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64</text>
<path d="M200 66C200 86 332 86 332 100" class="dg-l" marker-end="url(#fig-qkv-a)"/>
<rect x="274" y="102" width="116" height="34" rx="6" class="dg-b"/><text x="332" y="118" class="dg-h" font-size="12" text-anchor="middle">× W<tspan dy="3" font-size="0.72em">V</tspan><tspan dy="-3"></tspan></text><text x="332" y="133" class="dg-m" font-size="11" text-anchor="middle">512 × 64</text>
<path d="M332 138L332 154" class="dg-l" marker-end="url(#fig-qkv-a)"/>
<rect x="274" y="156" width="116" height="38" rx="6" class="dg-v"/><text x="332" y="174" class="dg-h" font-size="14" text-anchor="middle">V</text><text x="332" y="189" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64</text>
<path d="M10 212H390" class="dg-ld"/>
<text x="200" y="236" class="dg-m" font-size="11.5" text-anchor="middle">(n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512) × (512 × 64) = (n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64)</text>
<text x="200" y="256" class="dg-m" font-size="11.5" text-anchor="middle">Each of the 8 heads has its own three matrices.</text>
</svg>
<figcaption><strong>Figure 5. Three views of the same tokens.</strong> The same input is projected three ways. 64 is <em>d</em><sub>model</sub> ÷ 8 heads, which is how eight heads fit back into 512 at the end.</figcaption>
</figure>

Then attention is calculated using:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$

<figure class="diagram figSteps" id="fig-attnsteps" aria-label="Attention computed step by step on a three token example">
<input type="radio" name="fig-attnsteps" id="fig-attnsteps-1" checked><input type="radio" name="fig-attnsteps" id="fig-attnsteps-2"><input type="radio" name="fig-attnsteps" id="fig-attnsteps-3"><input type="radio" name="fig-attnsteps" id="fig-attnsteps-4">
<div class="stepTabs"><label for="fig-attnsteps-1">1. QK<tspan>⊤</tspan></label><label for="fig-attnsteps-2">2. Scale</label><label for="fig-attnsteps-3">3. Softmax</label><label for="fig-attnsteps-4">4. × V</label></div>
<div class="stepPanels"><div><svg viewBox="0 0 400 210" role="img" aria-labelledby="fig-attnsteps-p1-t fig-attnsteps-p1-d"><title id="fig-attnsteps-p1-t">Step one: queries times keys transposed</title><desc id="fig-attnsteps-p1-d">A 3 by 3 matrix of raw attention scores produced by multiplying Q by K transposed. Rows are the querying token, columns are the token being looked at. The values are 1, 0, 1 in the first row, 0, 1, 1 in the second, and 1, 1, 2 in the third.</desc><defs><marker id="fig-attnsteps-p1-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-attnsteps-p1-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">QK<tspan dy="-4" font-size="0.72em">⊤</tspan><tspan dy="4"></tspan> : every token scored against every token</text><text x="200" y="36" class="dg-m" font-size="11" text-anchor="middle">rows ask, columns answer</text><text x="151" y="48" class="dg-m" font-size="11" text-anchor="middle">The</text><text x="197" y="48" class="dg-m" font-size="11" text-anchor="middle">cat</text><text x="243" y="48" class="dg-m" font-size="11" text-anchor="middle">sat</text><text x="120" y="83" class="dg-m" font-size="11" text-anchor="end">The</text><text x="120" y="129" class="dg-m" font-size="11" text-anchor="end">cat</text><text x="120" y="175" class="dg-m" font-size="11" text-anchor="end">sat</text><rect x="128" y="56" width="46" height="46" class="dg-b"/><text x="151" y="83" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="174" y="56" width="46" height="46" class="dg-b"/><text x="197" y="83" class="dg-t" font-size="11" text-anchor="middle">0</text><rect x="220" y="56" width="46" height="46" class="dg-b"/><text x="243" y="83" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="128" y="102" width="46" height="46" class="dg-b"/><text x="151" y="129" class="dg-t" font-size="11" text-anchor="middle">0</text><rect x="174" y="102" width="46" height="46" class="dg-b"/><text x="197" y="129" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="220" y="102" width="46" height="46" class="dg-b"/><text x="243" y="129" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="128" y="148" width="46" height="46" class="dg-b"/><text x="151" y="175" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="174" y="148" width="46" height="46" class="dg-b"/><text x="197" y="175" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="220" y="148" width="46" height="46" class="dg-b"/><text x="243" y="175" class="dg-t" font-size="11" text-anchor="middle">2</text><text x="200" y="206" class="dg-m" font-size="11" text-anchor="middle">(3 × 2) × (2 × 3) = (3 × 3)</text></svg></div><div><svg viewBox="0 0 400 210" role="img" aria-labelledby="fig-attnsteps-p2-t fig-attnsteps-p2-d"><title id="fig-attnsteps-p2-t">Step two: divide by the square root of d k</title><desc id="fig-attnsteps-p2-d">The same 3 by 3 matrix with every entry divided by the square root of d k, which is the square root of 2 in this toy example. The values become 0.71, 0, 0.71 in the first row, 0, 0.71, 0.71 in the second, and 0.71, 0.71, 1.41 in the third.</desc><defs><marker id="fig-attnsteps-p2-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-attnsteps-p2-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">Divide by √d<tspan dy="3" font-size="0.72em">k</tspan><tspan dy="-3"></tspan> = √2 ≈ 1.41</text><text x="200" y="36" class="dg-m" font-size="11" text-anchor="middle">keeps the scores from getting too peaked</text><text x="151" y="48" class="dg-m" font-size="11" text-anchor="middle">The</text><text x="197" y="48" class="dg-m" font-size="11" text-anchor="middle">cat</text><text x="243" y="48" class="dg-m" font-size="11" text-anchor="middle">sat</text><text x="120" y="83" class="dg-m" font-size="11" text-anchor="end">The</text><text x="120" y="129" class="dg-m" font-size="11" text-anchor="end">cat</text><text x="120" y="175" class="dg-m" font-size="11" text-anchor="end">sat</text><rect x="128" y="56" width="46" height="46" class="dg-b"/><text x="151" y="83" class="dg-t" font-size="11" text-anchor="middle">0.71</text><rect x="174" y="56" width="46" height="46" class="dg-b"/><text x="197" y="83" class="dg-t" font-size="11" text-anchor="middle">0.00</text><rect x="220" y="56" width="46" height="46" class="dg-b"/><text x="243" y="83" class="dg-t" font-size="11" text-anchor="middle">0.71</text><rect x="128" y="102" width="46" height="46" class="dg-b"/><text x="151" y="129" class="dg-t" font-size="11" text-anchor="middle">0.00</text><rect x="174" y="102" width="46" height="46" class="dg-b"/><text x="197" y="129" class="dg-t" font-size="11" text-anchor="middle">0.71</text><rect x="220" y="102" width="46" height="46" class="dg-b"/><text x="243" y="129" class="dg-t" font-size="11" text-anchor="middle">0.71</text><rect x="128" y="148" width="46" height="46" class="dg-b"/><text x="151" y="175" class="dg-t" font-size="11" text-anchor="middle">0.71</text><rect x="174" y="148" width="46" height="46" class="dg-b"/><text x="197" y="175" class="dg-t" font-size="11" text-anchor="middle">0.71</text><rect x="220" y="148" width="46" height="46" class="dg-b"/><text x="243" y="175" class="dg-t" font-size="11" text-anchor="middle">1.41</text><text x="200" y="206" class="dg-m" font-size="11" text-anchor="middle">in the real model √d<tspan dy="3" font-size="0.72em">k</tspan><tspan dy="-3"></tspan> = √64 = 8</text></svg></div><div><svg viewBox="0 0 400 216" role="img" aria-labelledby="fig-attnsteps-p3-t fig-attnsteps-p3-d"><title id="fig-attnsteps-p3-t">Step three: softmax over each row</title><desc id="fig-attnsteps-p3-d">The scaled scores after a softmax applied along each row, so each row sums to one. The weights are 0.401, 0.198, 0.401 in the first row, 0.198, 0.401, 0.401 in the second, and 0.248, 0.248, 0.503 in the third. The largest weight in each row is highlighted.</desc><defs><marker id="fig-attnsteps-p3-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-attnsteps-p3-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">softmax across each row</text><text x="200" y="36" class="dg-m" font-size="11" text-anchor="middle">every row now sums to 1</text><text x="151" y="48" class="dg-m" font-size="11" text-anchor="middle">The</text><text x="197" y="48" class="dg-m" font-size="11" text-anchor="middle">cat</text><text x="243" y="48" class="dg-m" font-size="11" text-anchor="middle">sat</text><text x="120" y="83" class="dg-m" font-size="11" text-anchor="end">The</text><text x="120" y="129" class="dg-m" font-size="11" text-anchor="end">cat</text><text x="120" y="175" class="dg-m" font-size="11" text-anchor="end">sat</text><rect x="128" y="56" width="46" height="46" class="dg-a"/><text x="151" y="83" class="dg-t" font-size="11" text-anchor="middle">0.401</text><rect x="174" y="56" width="46" height="46" class="dg-b"/><text x="197" y="83" class="dg-t" font-size="11" text-anchor="middle">0.198</text><rect x="220" y="56" width="46" height="46" class="dg-a"/><text x="243" y="83" class="dg-t" font-size="11" text-anchor="middle">0.401</text><rect x="128" y="102" width="46" height="46" class="dg-b"/><text x="151" y="129" class="dg-t" font-size="11" text-anchor="middle">0.198</text><rect x="174" y="102" width="46" height="46" class="dg-a"/><text x="197" y="129" class="dg-t" font-size="11" text-anchor="middle">0.401</text><rect x="220" y="102" width="46" height="46" class="dg-a"/><text x="243" y="129" class="dg-t" font-size="11" text-anchor="middle">0.401</text><rect x="128" y="148" width="46" height="46" class="dg-b"/><text x="151" y="175" class="dg-t" font-size="11" text-anchor="middle">0.248</text><rect x="174" y="148" width="46" height="46" class="dg-b"/><text x="197" y="175" class="dg-t" font-size="11" text-anchor="middle">0.248</text><rect x="220" y="148" width="46" height="46" class="dg-a"/><text x="243" y="175" class="dg-t" font-size="11" text-anchor="middle">0.503</text><text x="200" y="206" class="dg-m" font-size="11" text-anchor="middle">“sat” leans hardest on itself (0.503)</text></svg></div><div><svg viewBox="0 0 400 216" role="img" aria-labelledby="fig-attnsteps-p4-t fig-attnsteps-p4-d"><title id="fig-attnsteps-p4-t">Step four: multiply the weights by the values</title><desc id="fig-attnsteps-p4-d">The attention weights multiply the value matrix V, whose rows are 2 and 0, 0 and 2, and 1 and 1. The result is a 3 by 2 output matrix with rows 1.203 and 0.797, 0.797 and 1.203, and 1.000 and 1.000. Each output row is a weighted blend of the value vectors.</desc><defs><marker id="fig-attnsteps-p4-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-attnsteps-p4-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">weights × V = the new representations</text><text x="86" y="44" class="dg-m" font-size="11" text-anchor="middle">V (3 × 2)</text><rect x="40" y="52" width="46" height="46" class="dg-v"/><text x="63" y="79" class="dg-t" font-size="11" text-anchor="middle">2</text><rect x="86" y="52" width="46" height="46" class="dg-v"/><text x="109" y="79" class="dg-t" font-size="11" text-anchor="middle">0</text><rect x="40" y="98" width="46" height="46" class="dg-v"/><text x="63" y="125" class="dg-t" font-size="11" text-anchor="middle">0</text><rect x="86" y="98" width="46" height="46" class="dg-v"/><text x="109" y="125" class="dg-t" font-size="11" text-anchor="middle">2</text><rect x="40" y="144" width="46" height="46" class="dg-v"/><text x="63" y="171" class="dg-t" font-size="11" text-anchor="middle">1</text><rect x="86" y="144" width="46" height="46" class="dg-v"/><text x="109" y="171" class="dg-t" font-size="11" text-anchor="middle">1</text><text x="200" y="120" class="dg-t" font-size="16" text-anchor="middle">→</text><text x="296" y="44" class="dg-m" font-size="11" text-anchor="middle">output (3 × 2)</text><rect x="250" y="52" width="46" height="46" class="dg-a"/><text x="273" y="79" class="dg-t" font-size="11" text-anchor="middle">1.203</text><rect x="296" y="52" width="46" height="46" class="dg-a"/><text x="319" y="79" class="dg-t" font-size="11" text-anchor="middle">0.797</text><rect x="250" y="98" width="46" height="46" class="dg-a"/><text x="273" y="125" class="dg-t" font-size="11" text-anchor="middle">0.797</text><rect x="296" y="98" width="46" height="46" class="dg-a"/><text x="319" y="125" class="dg-t" font-size="11" text-anchor="middle">1.203</text><rect x="250" y="144" width="46" height="46" class="dg-a"/><text x="273" y="171" class="dg-t" font-size="11" text-anchor="middle">1.000</text><rect x="296" y="144" width="46" height="46" class="dg-a"/><text x="319" y="171" class="dg-t" font-size="11" text-anchor="middle">1.000</text><text x="242" y="79" class="dg-m" font-size="11" text-anchor="end">The</text><text x="242" y="125" class="dg-m" font-size="11" text-anchor="end">cat</text><text x="242" y="171" class="dg-m" font-size="11" text-anchor="end">sat</text><text x="200" y="206" class="dg-m" font-size="11" text-anchor="middle">each row blends all three value vectors</text></svg></div></div>
<figcaption><strong>Figure 6. Attention, one step at a time.</strong> A toy example with 3 tokens and <em>d</em><sub>k</sub> = 2 so the arithmetic stays followable; the paper uses <em>d</em><sub>k</sub> = 64. Click the steps to walk through it. Every number here was computed from Q = [[1,0],[0,1],[1,1]], K the same, and V = [[2,0],[0,2],[1,1]].</figcaption>
</figure>

<div class="callout" role="note">

Jay Alammar created an excellent visual explanation of Transformers in [*The Illustrated Transformer*](https://jalammar.github.io/illustrated-transformer/). If you want another super digestible explanation of the architecture, I highly recommend checking it out.

</div>

In simpler terms, the model compares queries with keys to calculate attention weights, then uses those weights to combine the value vectors.

Multi-head attention repeats this operation using different learned projections, allowing the model to capture different relationships between tokens.

For the original Transformer:

- Each of the 8 attention heads produces an $n \times 64$ output.
- The outputs are concatenated into an $n \times 512$ matrix.
- A final learned output projection maps the concatenated representation back into the model's 512-dimensional space.

<figure class="diagram" id="fig-multihead">
<svg viewBox="0 0 400 308" role="img" aria-labelledby="fig-multihead-t fig-multihead-d">
<title id="fig-multihead-t">Eight attention heads concatenated and projected</title>
<desc id="fig-multihead-d">Eight attention heads run in parallel, each producing an n by 64 output. Their outputs are concatenated into an n by 512 matrix, then multiplied by a learned output projection W O of shape 512 by 512, giving the final multi-head output of n by 512. Eight heads times 64 equals 512, so the width comes back exactly.</desc>
<defs><marker id="fig-multihead-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-multihead-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="200" y="18" class="dg-h" font-size="13.5" text-anchor="middle">8 heads in parallel</text>
<rect x="10" y="30" width="40" height="46" rx="5" class="dg-a"/>
<text x="30" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="30" y="64" class="dg-h" font-size="11" text-anchor="middle">1</text>
<text x="30" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M30 96L30 110" class="dg-l"/>
<rect x="58" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="78" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="78" y="64" class="dg-h" font-size="11" text-anchor="middle">2</text>
<text x="78" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M78 96L78 110" class="dg-l"/>
<rect x="106" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="126" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="126" y="64" class="dg-h" font-size="11" text-anchor="middle">3</text>
<text x="126" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M126 96L126 110" class="dg-l"/>
<rect x="154" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="174" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="174" y="64" class="dg-h" font-size="11" text-anchor="middle">4</text>
<text x="174" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M174 96L174 110" class="dg-l"/>
<rect x="202" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="222" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="222" y="64" class="dg-h" font-size="11" text-anchor="middle">5</text>
<text x="222" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M222 96L222 110" class="dg-l"/>
<rect x="250" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="270" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="270" y="64" class="dg-h" font-size="11" text-anchor="middle">6</text>
<text x="270" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M270 96L270 110" class="dg-l"/>
<rect x="298" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="318" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="318" y="64" class="dg-h" font-size="11" text-anchor="middle">7</text>
<text x="318" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M318 96L318 110" class="dg-l"/>
<rect x="346" y="30" width="40" height="46" rx="5" class="dg-b"/>
<text x="366" y="50" class="dg-t" font-size="10.5" text-anchor="middle">head</text>
<text x="366" y="64" class="dg-h" font-size="11" text-anchor="middle">8</text>
<text x="366" y="90" class="dg-m" font-size="9.5" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan>×64</text>
<path d="M366 96L366 110" class="dg-l"/>
<path d="M30 110H370" class="dg-l"/>
<path d="M200 110L200 126" class="dg-l" marker-end="url(#fig-multihead-a)"/>
<rect x="60" y="128" width="280" height="36" rx="6" class="dg-b"/><text x="200" y="145" class="dg-h" font-size="12.5" text-anchor="middle">concatenate</text><text x="200" y="160" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M200 166L200 182" class="dg-l" marker-end="url(#fig-multihead-a)"/>
<rect x="60" y="184" width="280" height="34" rx="6" class="dg-b"/><text x="200" y="200" class="dg-h" font-size="12.5" text-anchor="middle">× W<tspan dy="3" font-size="0.72em">O</tspan><tspan dy="-3"></tspan></text><text x="200" y="215" class="dg-m" font-size="11" text-anchor="middle">512 × 512</text>
<path d="M200 220L200 236" class="dg-la" marker-end="url(#fig-multihead-b)"/>
<rect x="60" y="238" width="280" height="36" rx="6" class="dg-a"/><text x="200" y="255" class="dg-h" font-size="12.5" text-anchor="middle">multi-head output</text><text x="200" y="270" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<text x="200" y="296" class="dg-m" font-size="11.5" text-anchor="middle">8 heads × 64 = 512, so the width comes back exactly.</text>
</svg>
<figcaption><strong>Figure 7. Why 64 and why 8.</strong> Each head looks for a different kind of relationship. They are concatenated and passed through one more learned matrix so the layer hands back the same 512-wide shape it received.</figcaption>
</figure>

### The Final Encoder Output

After passing through all six encoder layers, we obtain a contextual representation for every input token.

For $n$ input tokens, the final encoder output has dimensions:

$$
n \times 512
$$

These representations contain contextual information from the input sentence and are used by the decoder's cross-attention layers.

Each decoder layer learns its own key and value projections from the encoder's final output.

<figure class="diagram" id="fig-encoderstack">
<svg viewBox="0 0 400 414" role="img" aria-labelledby="fig-encoderstack-t fig-encoderstack-d">
<title id="fig-encoderstack-t">Six encoder layers and where their output goes</title>
<desc id="fig-encoderstack-d">The input, n by 512, passes through six stacked encoder layers, each keeping the shape n by 512. The final encoder output, n by 512, is routed into every decoder layer's cross-attention, where each layer learns its own key and value projections from it.</desc>
<defs><marker id="fig-encoderstack-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-encoderstack-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<rect x="110" y="14" width="180" height="32" rx="6" class="dg-b"/><text x="200" y="29" class="dg-h" font-size="12" text-anchor="middle">input</text><text x="200" y="44" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M200 46L200 54" class="dg-l" marker-end="url(#fig-encoderstack-a)"/>
<rect x="110" y="56" width="180" height="28" rx="6" class="dg-a"/><text x="200" y="74.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder layer 1</text>
<path d="M200 84L200 92" class="dg-l" marker-end="url(#fig-encoderstack-a)"/>
<rect x="110" y="94" width="180" height="28" rx="6" class="dg-a"/><text x="200" y="112.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder layer 2</text>
<path d="M200 122L200 130" class="dg-l" marker-end="url(#fig-encoderstack-a)"/>
<rect x="110" y="132" width="180" height="28" rx="6" class="dg-a"/><text x="200" y="150.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder layer 3</text>
<path d="M200 160L200 168" class="dg-l" marker-end="url(#fig-encoderstack-a)"/>
<rect x="110" y="170" width="180" height="28" rx="6" class="dg-a"/><text x="200" y="188.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder layer 4</text>
<path d="M200 198L200 206" class="dg-l" marker-end="url(#fig-encoderstack-a)"/>
<rect x="110" y="208" width="180" height="28" rx="6" class="dg-a"/><text x="200" y="226.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder layer 5</text>
<path d="M200 236L200 244" class="dg-l" marker-end="url(#fig-encoderstack-a)"/>
<rect x="110" y="246" width="180" height="28" rx="6" class="dg-a"/><text x="200" y="264.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder layer 6</text>
<path d="M200 274L200 282" class="dg-la" marker-end="url(#fig-encoderstack-b)"/>
<rect x="84" y="284" width="232" height="38" rx="6" class="dg-a"/><text x="200" y="302" class="dg-h" font-size="12.5" text-anchor="middle">final encoder output</text><text x="200" y="317" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M316 303H356V354" class="dg-la"/>
<path d="M356 354H300" class="dg-la" marker-end="url(#fig-encoderstack-b)"/>
<rect x="64" y="335" width="236" height="38" rx="6" class="dg-w"/><text x="182" y="353" class="dg-h" font-size="11" text-anchor="middle">every decoder layer's cross-attention</text><text x="182" y="368" class="dg-m" font-size="11" text-anchor="middle">its own K and V projections</text>
<text x="200" y="400" class="dg-m" font-size="11" text-anchor="middle">the same encoder output feeds all six decoder layers</text>
</svg>
<figcaption><strong>Figure 8. The handoff.</strong> One encoder output, computed once, is reused by all six decoder layers. Each of those layers learns its own K and V projections from it.</figcaption>
</figure>

## Now We Can Talk About the Decoder!

Again, for simplicity's sake, we'll just talk about one decoder layer because the original paper used six layers with the same architecture.

Each decoder layer has three main sublayers:

### 1. Masked Self-Attention

Masked self-attention allows each output token to attend only to itself and earlier output tokens, preventing it from seeing future tokens.

<figure class="diagram figSteps" id="fig-mask" aria-label="The causal mask in the decoder, before and after">
<input type="radio" name="fig-mask" id="fig-mask-1" checked><input type="radio" name="fig-mask" id="fig-mask-2">
<div class="stepTabs"><label for="fig-mask-1">Before the mask</label><label for="fig-mask-2">After the mask</label></div>
<div class="stepPanels"><div><svg viewBox="0 0 400 290" role="img" aria-labelledby="fig-mask-p1-t fig-mask-p1-d"><title id="fig-mask-p1-t">Scores before masking</title><desc id="fig-mask-p1-d">A four by four grid of attention scores where every output position can see every other position, including positions that come later in the sentence.</desc><defs><marker id="fig-mask-p1-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-mask-p1-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">Raw scores: every position sees every position</text><text x="200" y="36" class="dg-m" font-size="11" text-anchor="middle">including words that have not been written yet</text><text x="112" y="88" class="dg-m" font-size="11" text-anchor="end">J'</text><text x="112" y="140" class="dg-m" font-size="11" text-anchor="end">aime</text><text x="112" y="192" class="dg-m" font-size="11" text-anchor="end">les</text><text x="112" y="244" class="dg-m" font-size="11" text-anchor="end">chats</text><text x="146" y="50" class="dg-m" font-size="11" text-anchor="middle">J'</text><text x="198" y="50" class="dg-m" font-size="11" text-anchor="middle">aime</text><text x="250" y="50" class="dg-m" font-size="11" text-anchor="middle">les</text><text x="302" y="50" class="dg-m" font-size="11" text-anchor="middle">chats</text><rect x="120" y="58" width="52" height="52" class="dg-b"/><text x="146" y="88" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="172" y="58" width="52" height="52" class="dg-b"/><text x="198" y="88" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="224" y="58" width="52" height="52" class="dg-b"/><text x="250" y="88" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="276" y="58" width="52" height="52" class="dg-b"/><text x="302" y="88" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="120" y="110" width="52" height="52" class="dg-b"/><text x="146" y="140" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="172" y="110" width="52" height="52" class="dg-b"/><text x="198" y="140" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="224" y="110" width="52" height="52" class="dg-b"/><text x="250" y="140" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="276" y="110" width="52" height="52" class="dg-b"/><text x="302" y="140" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="120" y="162" width="52" height="52" class="dg-b"/><text x="146" y="192" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="172" y="162" width="52" height="52" class="dg-b"/><text x="198" y="192" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="224" y="162" width="52" height="52" class="dg-b"/><text x="250" y="192" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="276" y="162" width="52" height="52" class="dg-b"/><text x="302" y="192" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="120" y="214" width="52" height="52" class="dg-b"/><text x="146" y="244" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="172" y="214" width="52" height="52" class="dg-b"/><text x="198" y="244" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="224" y="214" width="52" height="52" class="dg-b"/><text x="250" y="244" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="276" y="214" width="52" height="52" class="dg-b"/><text x="302" y="244" class="dg-t" font-size="11" text-anchor="middle">0.9</text><text x="200" y="282" class="dg-m" font-size="11" text-anchor="middle">the upper right is the problem: that is the future</text></svg></div><div><svg viewBox="0 0 400 290" role="img" aria-labelledby="fig-mask-p2-t fig-mask-p2-d"><title id="fig-mask-p2-t">Scores after the causal mask</title><desc id="fig-mask-p2-d">The same four by four grid with every cell above the diagonal set to minus infinity before the softmax, so each row can only attend to itself and earlier positions. The lower triangle keeps its scores and the upper triangle is struck out.</desc><defs><marker id="fig-mask-p2-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-mask-p2-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">After masking: set the future to −∞</text><text x="200" y="36" class="dg-m" font-size="11" text-anchor="middle">softmax turns −∞ into a weight of exactly 0</text><text x="112" y="88" class="dg-m" font-size="11" text-anchor="end">J'</text><text x="112" y="140" class="dg-m" font-size="11" text-anchor="end">aime</text><text x="112" y="192" class="dg-m" font-size="11" text-anchor="end">les</text><text x="112" y="244" class="dg-m" font-size="11" text-anchor="end">chats</text><text x="146" y="50" class="dg-m" font-size="11" text-anchor="middle">J'</text><text x="198" y="50" class="dg-m" font-size="11" text-anchor="middle">aime</text><text x="250" y="50" class="dg-m" font-size="11" text-anchor="middle">les</text><text x="302" y="50" class="dg-m" font-size="11" text-anchor="middle">chats</text><rect x="120" y="58" width="52" height="52" class="dg-b"/><text x="146" y="88" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="172" y="58" width="52" height="52" class="dg-off"/><rect x="224" y="58" width="52" height="52" class="dg-off"/><rect x="276" y="58" width="52" height="52" class="dg-off"/><rect x="120" y="110" width="52" height="52" class="dg-b"/><text x="146" y="140" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="172" y="110" width="52" height="52" class="dg-b"/><text x="198" y="140" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="224" y="110" width="52" height="52" class="dg-off"/><rect x="276" y="110" width="52" height="52" class="dg-off"/><rect x="120" y="162" width="52" height="52" class="dg-b"/><text x="146" y="192" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="172" y="162" width="52" height="52" class="dg-b"/><text x="198" y="192" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="224" y="162" width="52" height="52" class="dg-b"/><text x="250" y="192" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="276" y="162" width="52" height="52" class="dg-off"/><rect x="120" y="214" width="52" height="52" class="dg-b"/><text x="146" y="244" class="dg-t" font-size="11" text-anchor="middle">0.9</text><rect x="172" y="214" width="52" height="52" class="dg-b"/><text x="198" y="244" class="dg-t" font-size="11" text-anchor="middle">0.6</text><rect x="224" y="214" width="52" height="52" class="dg-b"/><text x="250" y="244" class="dg-t" font-size="11" text-anchor="middle">0.8</text><rect x="276" y="214" width="52" height="52" class="dg-b"/><text x="302" y="244" class="dg-t" font-size="11" text-anchor="middle">0.9</text><text x="198" y="88" class="dg-m" font-size="13" text-anchor="middle">−∞</text><text x="250" y="88" class="dg-m" font-size="13" text-anchor="middle">−∞</text><text x="302" y="88" class="dg-m" font-size="13" text-anchor="middle">−∞</text><text x="250" y="140" class="dg-m" font-size="13" text-anchor="middle">−∞</text><text x="302" y="140" class="dg-m" font-size="13" text-anchor="middle">−∞</text><text x="302" y="192" class="dg-m" font-size="13" text-anchor="middle">−∞</text><text x="200" y="282" class="dg-m" font-size="11" text-anchor="middle">“aime” may look at “J'” and itself, nothing after</text></svg></div></div>
<figcaption><strong>Figure 9. Hiding the future.</strong> The scores are set to −∞ above the diagonal <em>before</em> the softmax, so those positions come out as exactly zero weight. Without this, the model could cheat during training by reading the answer.</figcaption>
</figure>

### 2. Cross-Attention

Cross-attention uses queries from the decoder and keys and values derived from the encoder's final output.

This allows the decoder to access information from the input sequence when generating its translation.

For $m$ decoder positions and $n$ encoder positions, the attention score matrix has dimensions $m \times n$.

<figure class="diagram" id="fig-cross">
<svg viewBox="0 0 400 378" role="img" aria-labelledby="fig-cross-t fig-cross-d">
<title id="fig-cross-t">Cross-attention between decoder queries and encoder keys and values</title>
<desc id="fig-cross-d">The decoder's representations so far, m by 512, are projected into queries Q of shape m by 64. The encoder output, n by 512, is projected into keys K and values V, each n by 64. The score matrix is therefore m by n, not square, unlike in self-attention. After a softmax the scores multiply V to give an output of m by 64 per head.</desc>
<defs><marker id="fig-cross-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-cross-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="200" y="17" class="dg-h" font-size="13" text-anchor="middle">Cross-attention</text>
<text x="200" y="33" class="dg-m" font-size="11.5" text-anchor="middle">queries from the decoder, keys and values from the encoder</text>
<rect x="10" y="44" width="170" height="36" rx="6" class="dg-b"/><text x="95" y="61" class="dg-h" font-size="12" text-anchor="middle">decoder so far</text><text x="95" y="76" class="dg-m" font-size="11" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<rect x="220" y="44" width="170" height="36" rx="6" class="dg-b"/><text x="305" y="61" class="dg-h" font-size="12" text-anchor="middle">encoder output</text><text x="305" y="76" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M95 82L95 94" class="dg-l" marker-end="url(#fig-cross-a)"/>
<rect x="28" y="96" width="134" height="34" rx="6" class="dg-a"/><text x="95" y="112" class="dg-h" font-size="13" text-anchor="middle">Q</text><text x="95" y="127" class="dg-m" font-size="11" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64</text>
<path d="M305 82C305 88 262 88 262 94" class="dg-l" marker-end="url(#fig-cross-a)"/>
<path d="M305 82C305 88 348 88 348 94" class="dg-l" marker-end="url(#fig-cross-a)"/>
<rect x="214" y="96" width="96" height="34" rx="6" class="dg-w"/><text x="262" y="112" class="dg-h" font-size="13" text-anchor="middle">K</text><text x="262" y="127" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64</text>
<rect x="318" y="96" width="72" height="34" rx="6" class="dg-v"/><text x="354" y="112" class="dg-h" font-size="13" text-anchor="middle">V</text><text x="354" y="127" class="dg-m" font-size="11" text-anchor="middle">n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64</text>
<path d="M95 132L95 160" class="dg-l" marker-end="url(#fig-cross-a)"/>
<path d="M262 132L180 160" class="dg-l" marker-end="url(#fig-cross-a)"/>
<rect x="60" y="162" width="280" height="38" rx="6" class="dg-b"/><text x="200" y="180" class="dg-h" font-size="12.5" text-anchor="middle">scores = QK<tspan dy="-4" font-size="0.72em">⊤</tspan><tspan dy="4"></tspan> / √d<tspan dy="3" font-size="0.72em">k</tspan><tspan dy="-3"></tspan></text><text x="200" y="195" class="dg-m" font-size="11" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan></text>
<path d="M200 202L200 218" class="dg-l" marker-end="url(#fig-cross-a)"/>
<rect x="60" y="220" width="280" height="34" rx="6" class="dg-b"/><text x="200" y="241.5" class="dg-h" font-size="12.5" text-anchor="middle">softmax, then × V</text>
<path d="M200 256L200 272" class="dg-la" marker-end="url(#fig-cross-b)"/>
<rect x="90" y="274" width="220" height="36" rx="6" class="dg-a"/><text x="200" y="291" class="dg-h" font-size="12.5" text-anchor="middle">output</text><text x="200" y="306" class="dg-m" font-size="11" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 64 per head</text>
<path d="M10 324H390" class="dg-ld"/>
<text x="200" y="348" class="dg-m" font-size="11.5" text-anchor="middle">Self-attention scores are square. These are not:</text>
<text x="200" y="366" class="dg-m" font-size="11.5" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> output positions × n<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> input positions.</text>
</svg>
<figcaption><strong>Figure 10. Where the translation looks back at the source.</strong> This is the one place the two stacks meet. The score matrix is <em>m</em> × <em>n</em>, which is the giveaway that it is not self-attention.</figcaption>
</figure>

### 3. Feed-Forward Network

The feed-forward network transforms each token representation through learned nonlinear layers, just like the FFNs in the encoder.

Each decoder layer also uses residual connections and layer normalization.

### Autoregressive Generation

The key difference to note is that the decoder generates output **AUTOREGRESSIVELY**, predicting one token at a time during inference.

Unlike the encoder, which has access to the entire input sequence, the decoder must generate each new output token using only previously generated output tokens and the encoder's representations.

<figure class="diagram figSteps" id="fig-autoregressive" aria-label="Generating a translation one token at a time">
<input type="radio" name="fig-autoregressive" id="fig-autoregressive-1" checked><input type="radio" name="fig-autoregressive" id="fig-autoregressive-2"><input type="radio" name="fig-autoregressive" id="fig-autoregressive-3"><input type="radio" name="fig-autoregressive" id="fig-autoregressive-4">
<div class="stepTabs"><label for="fig-autoregressive-1">Step 1</label><label for="fig-autoregressive-2">Step 2</label><label for="fig-autoregressive-3">Step 3</label><label for="fig-autoregressive-4">Step 4</label></div>
<div class="stepPanels"><div><svg viewBox="0 0 400 226" role="img" aria-labelledby="fig-autoregressive-p1-t fig-autoregressive-p1-d"><title id="fig-autoregressive-p1-t">Step 1 of autoregressive decoding</title><desc id="fig-autoregressive-p1-d">The encoder input, the sentence I love cats, stays the same. The decoder has been given s and predicts the next token, J'.</desc><defs><marker id="fig-autoregressive-p1-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-autoregressive-p1-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">Step 1</text><rect x="10" y="32" width="380" height="32" rx="6" class="dg-b"/><text x="200" y="52.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder input: “I love cats.” (unchanged every step)</text><text x="10" y="86" class="dg-m" font-size="11.5" text-anchor="start">decoder has been given:</text><rect x="10" y="98" width="50" height="32" rx="5" class="dg-b"/><text x="35" y="118" class="dg-t" font-size="12" text-anchor="middle">&lt;s&gt;</text><path d="M14 136H60" class="dg-ld"/><path d="M37 136V146C37 150 200 148 200 152" class="dg-la" marker-end="url(#fig-autoregressive-b)"/><rect x="108" y="154" width="184" height="36" rx="6" class="dg-a"/><text x="200" y="176.5" class="dg-h" font-size="13" text-anchor="middle">predicts: J'</text><text x="200" y="212" class="dg-m" font-size="11.5" text-anchor="middle">that token is appended, then we go again</text></svg></div><div><svg viewBox="0 0 400 226" role="img" aria-labelledby="fig-autoregressive-p2-t fig-autoregressive-p2-d"><title id="fig-autoregressive-p2-t">Step 2 of autoregressive decoding</title><desc id="fig-autoregressive-p2-d">The encoder input, the sentence I love cats, stays the same. The decoder has been given s, J' and predicts the next token, aime.</desc><defs><marker id="fig-autoregressive-p2-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-autoregressive-p2-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">Step 2</text><rect x="10" y="32" width="380" height="32" rx="6" class="dg-b"/><text x="200" y="52.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder input: “I love cats.” (unchanged every step)</text><text x="10" y="86" class="dg-m" font-size="11.5" text-anchor="start">decoder has been given:</text><rect x="10" y="98" width="50" height="32" rx="5" class="dg-b"/><text x="35" y="118" class="dg-t" font-size="12" text-anchor="middle">&lt;s&gt;</text><rect x="68" y="98" width="42" height="32" rx="5" class="dg-b"/><text x="89" y="118" class="dg-t" font-size="12" text-anchor="middle">J'</text><path d="M14 136H110" class="dg-ld"/><path d="M55 136V146C55 150 200 148 200 152" class="dg-la" marker-end="url(#fig-autoregressive-b)"/><rect x="108" y="154" width="184" height="36" rx="6" class="dg-a"/><text x="200" y="176.5" class="dg-h" font-size="13" text-anchor="middle">predicts: aime</text><text x="200" y="212" class="dg-m" font-size="11.5" text-anchor="middle">that token is appended, then we go again</text></svg></div><div><svg viewBox="0 0 400 226" role="img" aria-labelledby="fig-autoregressive-p3-t fig-autoregressive-p3-d"><title id="fig-autoregressive-p3-t">Step 3 of autoregressive decoding</title><desc id="fig-autoregressive-p3-d">The encoder input, the sentence I love cats, stays the same. The decoder has been given s, J', aime and predicts the next token, les.</desc><defs><marker id="fig-autoregressive-p3-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-autoregressive-p3-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">Step 3</text><rect x="10" y="32" width="380" height="32" rx="6" class="dg-b"/><text x="200" y="52.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder input: “I love cats.” (unchanged every step)</text><text x="10" y="86" class="dg-m" font-size="11.5" text-anchor="start">decoder has been given:</text><rect x="10" y="98" width="50" height="32" rx="5" class="dg-b"/><text x="35" y="118" class="dg-t" font-size="12" text-anchor="middle">&lt;s&gt;</text><rect x="68" y="98" width="42" height="32" rx="5" class="dg-b"/><text x="89" y="118" class="dg-t" font-size="12" text-anchor="middle">J'</text><rect x="118" y="98" width="60" height="32" rx="5" class="dg-b"/><text x="148" y="118" class="dg-t" font-size="12" text-anchor="middle">aime</text><path d="M14 136H178" class="dg-ld"/><path d="M89 136V146C89 150 200 148 200 152" class="dg-la" marker-end="url(#fig-autoregressive-b)"/><rect x="108" y="154" width="184" height="36" rx="6" class="dg-a"/><text x="200" y="176.5" class="dg-h" font-size="13" text-anchor="middle">predicts: les</text><text x="200" y="212" class="dg-m" font-size="11.5" text-anchor="middle">that token is appended, then we go again</text></svg></div><div><svg viewBox="0 0 400 226" role="img" aria-labelledby="fig-autoregressive-p4-t fig-autoregressive-p4-d"><title id="fig-autoregressive-p4-t">Step 4 of autoregressive decoding</title><desc id="fig-autoregressive-p4-d">The encoder input, the sentence I love cats, stays the same. The decoder has been given s, J', aime, les and predicts the next token, chats.</desc><defs><marker id="fig-autoregressive-p4-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-autoregressive-p4-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="18" class="dg-h" font-size="12.5" text-anchor="middle">Step 4</text><rect x="10" y="32" width="380" height="32" rx="6" class="dg-b"/><text x="200" y="52.5" class="dg-h" font-size="11.5" text-anchor="middle">encoder input: “I love cats.” (unchanged every step)</text><text x="10" y="86" class="dg-m" font-size="11.5" text-anchor="start">decoder has been given:</text><rect x="10" y="98" width="50" height="32" rx="5" class="dg-b"/><text x="35" y="118" class="dg-t" font-size="12" text-anchor="middle">&lt;s&gt;</text><rect x="68" y="98" width="42" height="32" rx="5" class="dg-b"/><text x="89" y="118" class="dg-t" font-size="12" text-anchor="middle">J'</text><rect x="118" y="98" width="60" height="32" rx="5" class="dg-b"/><text x="148" y="118" class="dg-t" font-size="12" text-anchor="middle">aime</text><rect x="186" y="98" width="50" height="32" rx="5" class="dg-b"/><text x="211" y="118" class="dg-t" font-size="12" text-anchor="middle">les</text><path d="M14 136H236" class="dg-ld"/><path d="M118 136V146C118 150 200 148 200 152" class="dg-la" marker-end="url(#fig-autoregressive-b)"/><rect x="108" y="154" width="184" height="36" rx="6" class="dg-a"/><text x="200" y="176.5" class="dg-h" font-size="13" text-anchor="middle">predicts: chats</text><text x="200" y="212" class="dg-m" font-size="11.5" text-anchor="middle">next step would produce the end-of-sequence token</text></svg></div></div>
<figcaption><strong>Figure 11. One token at a time.</strong> The encoder runs once. The decoder re-runs for every token, each time with one more token of its own output as input. This is what makes generation sequential, and slow, compared with the encoder.</figcaption>
</figure>

During training, however, the masked attention mechanism allows predictions for multiple target positions to be computed in parallel.

The decoder receives the target sequence shifted right by one position and uses causal masking to prevent access to future target tokens.

<figure class="diagram" id="fig-trainvsinfer">
<svg viewBox="0 0 400 268" role="img" aria-labelledby="fig-trainvsinfer-t fig-trainvsinfer-d">
<title id="fig-trainvsinfer-t">Training predicts every position at once; inference generates one token at a time</title>
<desc id="fig-trainvsinfer-d">Two columns. Training: the decoder is given the whole target sequence shifted right by one, a causal mask hides the future, and all positions are predicted in a single parallel pass, so it is one pass over the sentence. Inference: start from the start token, predict one token, append it and run again, repeating until the end-of-sequence token, so it is one pass per token.</desc>
<defs><marker id="fig-trainvsinfer-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-trainvsinfer-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="104" y="18" class="dg-h" font-size="13" text-anchor="middle">Training</text>
<text x="296" y="18" class="dg-h" font-size="13" text-anchor="middle">Inference</text>
<text x="104" y="36" class="dg-m" font-size="11" text-anchor="middle">we already know the answer</text>
<text x="296" y="36" class="dg-m" font-size="11" text-anchor="middle">we do not</text>
<path d="M200 46V300" class="dg-ld"/>
<rect x="10" y="56" width="180" height="46" rx="6" class="dg-b"/>
<text x="100" y="76" class="dg-t" font-size="11.5" text-anchor="middle">give the decoder the whole</text>
<text x="100" y="92" class="dg-t" font-size="11.5" text-anchor="middle">target, shifted right</text>
<rect x="10" y="114" width="180" height="32" rx="6" class="dg-b"/>
<text x="100" y="134" class="dg-t" font-size="11.5" text-anchor="middle">causal mask hides the future</text>
<rect x="10" y="158" width="180" height="46" rx="6" class="dg-b"/>
<text x="100" y="178" class="dg-t" font-size="11.5" text-anchor="middle">all positions predicted</text>
<text x="100" y="194" class="dg-t" font-size="11.5" text-anchor="middle">in one parallel pass</text>
<rect x="210" y="56" width="180" height="32" rx="6" class="dg-w"/>
<text x="300" y="76" class="dg-t" font-size="11.5" text-anchor="middle">start from the start token</text>
<path d="M300 90L300 98" class="dg-l" marker-end="url(#fig-trainvsinfer-a)"/>
<rect x="210" y="100" width="180" height="32" rx="6" class="dg-b"/>
<text x="300" y="120" class="dg-t" font-size="11.5" text-anchor="middle">predict one token</text>
<path d="M300 134L300 142" class="dg-l" marker-end="url(#fig-trainvsinfer-a)"/>
<rect x="210" y="144" width="180" height="32" rx="6" class="dg-b"/>
<text x="300" y="164" class="dg-t" font-size="11.5" text-anchor="middle">append it and run again</text>
<path d="M300 178L300 186" class="dg-l" marker-end="url(#fig-trainvsinfer-a)"/>
<rect x="210" y="188" width="180" height="32" rx="6" class="dg-b"/>
<text x="300" y="208" class="dg-t" font-size="11.5" text-anchor="middle">repeat until end-of-sequence</text>
<path d="M372 204C392 204 392 116 376 116" class="dg-la" marker-end="url(#fig-trainvsinfer-b)"/>
<text x="104" y="248" class="dg-t" font-size="11.5" text-anchor="middle">one pass over the sentence</text>
<text x="296" y="248" class="dg-t" font-size="11.5" text-anchor="middle">one pass per token</text>
</svg>
<figcaption><strong>Figure 12. The same mask, two very different costs.</strong> Masking is what lets training score every position in one pass. At inference there is nothing to mask yet, because the tokens do not exist until the model writes them.</figcaption>
</figure>

## At Last, We've Reached the Final Part of the Transformer Architecture

### The Final Linear Layer and Softmax

What do these do?

After the final decoder layer, we have output representations with dimensions $m \times 512$.

These representations pass through a linear transformation that maps the 512-dimensional vectors to vocabulary-sized logits.

Why do we need this?

Because we need these learned representations to map to specific tokens in our vocabulary.

For a target vocabulary containing $V$ tokens:

- Decoder output: $m \times 512$
- Output projection weight matrix: $512 \times V$
- Logits: $m \times V$
- Softmax output: $m \times V$

Each row represents a probability distribution over the target vocabulary for one output position.

The softmax converts the logits into probabilities.

<figure class="diagram" id="fig-finallinear">
<svg viewBox="0 0 400 388" role="img" aria-labelledby="fig-finallinear-t fig-finallinear-d">
<title id="fig-finallinear-t">Turning the decoder's vectors into token probabilities</title>
<desc id="fig-finallinear-d">The decoder output, m by 512, is multiplied by an output matrix of shape 512 by the vocabulary size V, producing logits of shape m by V. A softmax turns each row into a probability distribution over the vocabulary. A bar chart shows illustrative probabilities for a five word vocabulary: chats 0.82, chiens 0.09, les 0.04, aime 0.03 and end of sequence 0.02.</desc>
<defs><marker id="fig-finallinear-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-finallinear-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<rect x="110" y="14" width="180" height="34" rx="6" class="dg-b"/><text x="200" y="30" class="dg-h" font-size="12" text-anchor="middle">decoder output</text><text x="200" y="45" class="dg-m" font-size="11" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × 512</text>
<path d="M200 50L200 64" class="dg-l" marker-end="url(#fig-finallinear-a)"/>
<rect x="90" y="66" width="220" height="34" rx="6" class="dg-b"/><text x="200" y="82" class="dg-h" font-size="12" text-anchor="middle">× output matrix</text><text x="200" y="97" class="dg-m" font-size="11" text-anchor="middle">512 × V<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan></text>
<path d="M200 102L200 116" class="dg-l" marker-end="url(#fig-finallinear-a)"/>
<rect x="110" y="118" width="180" height="34" rx="6" class="dg-b"/><text x="200" y="134" class="dg-h" font-size="12" text-anchor="middle">logits</text><text x="200" y="149" class="dg-m" font-size="11" text-anchor="middle">m<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan> × V<tspan dy="3" font-size="0.72em"></tspan><tspan dy="-3"></tspan></text>
<path d="M200 154L200 168" class="dg-la" marker-end="url(#fig-finallinear-b)"/>
<rect x="140" y="170" width="120" height="30" rx="6" class="dg-a"/><text x="200" y="189.5" class="dg-h" font-size="12" text-anchor="middle">softmax</text>
<text x="200" y="222" class="dg-m" font-size="11.5" text-anchor="middle">one row = one probability distribution over the vocabulary</text>
<text x="96" y="253" class="dg-t" font-size="11.5" text-anchor="end">chats</text>
<rect x="106" y="240" width="196.8" height="18" rx="3" class="dg-bar-a"/>
<text x="308.79999999999995" y="253" class="dg-t" font-size="11" text-anchor="start">0.82</text>
<text x="96" y="277" class="dg-t" font-size="11.5" text-anchor="end">chiens</text>
<rect x="106" y="264" width="21.6" height="18" rx="3" class="dg-bar"/>
<text x="133.6" y="277" class="dg-t" font-size="11" text-anchor="start">0.09</text>
<text x="96" y="301" class="dg-t" font-size="11.5" text-anchor="end">les</text>
<rect x="106" y="288" width="9.6" height="18" rx="3" class="dg-bar"/>
<text x="121.6" y="301" class="dg-t" font-size="11" text-anchor="start">0.04</text>
<text x="96" y="325" class="dg-t" font-size="11.5" text-anchor="end">aime</text>
<rect x="106" y="312" width="7.2" height="18" rx="3" class="dg-bar"/>
<text x="119.2" y="325" class="dg-t" font-size="11" text-anchor="start">0.03</text>
<text x="96" y="349" class="dg-t" font-size="11.5" text-anchor="end">&lt;eos&gt;</text>
<rect x="106" y="336" width="4.8" height="18" rx="3" class="dg-bar"/>
<text x="116.8" y="349" class="dg-t" font-size="11" text-anchor="start">0.02</text>
<text x="200" y="378" class="dg-m" font-size="11" text-anchor="middle">illustrative numbers, not real model output</text>
</svg>
<figcaption><strong>Figure 13. From vectors back to words.</strong> <em>V</em> is your vocabulary size, set by the tokenizer, not by the architecture. The probabilities shown are made up for illustration.</figcaption>
</figure>

<div class="callout" role="note">

**One detail from the paper.** That $512 \times V$ output matrix isn't actually a separate set of weights. The authors share the same weight matrix between the two embedding layers and the pre-softmax linear transformation, and multiply the embedding weights by $\sqrt{d_\text{model}}$. So the matrix that turns tokens into vectors at the input is the same one that turns vectors back into token scores at the output.

</div>

The model then uses this distribution to select or sample the next token!

### How Does the Model LEARN?

By minimizing **cross-entropy loss**, comparing its predicted token distributions against the correct target tokens:

$$
L = -\sum_i y_i \log(p_i)
$$

where $y_i$ represents the target distribution and $p_i$ represents the predicted probability for token $i$.

For a one-hot target, the loss simplifies to the negative log probability assigned to the correct token. The original Transformer paper also used label smoothing of value $\epsilon_{ls} = 0.1$, so the actual training target was not strictly one-hot.

<figure class="diagram" id="fig-loss">
<svg viewBox="0 0 400 344" role="img" aria-labelledby="fig-loss-t fig-loss-d">
<title id="fig-loss-t">Cross-entropy between the predicted distribution and the target</title>
<desc id="fig-loss-d">Two bar charts side by side. On the left the predicted probabilities: chats 0.82, chiens 0.09, les 0.04, aime 0.03, end of sequence 0.02. On the right the one-hot target, with chats at 1 and everything else at 0. The loss is minus the log of 0.82, about 0.20, because only the correct token's probability enters the sum. An arrow leads to backpropagation and a weight update. A note explains that with label smoothing of 0.1 the target is not a perfect one and zero, so some loss always remains.</desc>
<defs><marker id="fig-loss-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-loss-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="200" y="18" class="dg-h" font-size="13" text-anchor="middle">Scoring the prediction</text>
<text x="110" y="44" class="dg-m" font-size="11.5" text-anchor="middle">predicted</text>
<text x="268" y="44" class="dg-m" font-size="11.5" text-anchor="middle">target</text>
<text x="62" y="67" class="dg-t" font-size="11.5" text-anchor="end">chats</text>
<rect x="70" y="54" width="98.4" height="18" rx="3" class="dg-bar-a"/>
<text x="196" y="67" class="dg-t" font-size="11" text-anchor="start">0.82</text>
<rect x="232" y="54" width="120" height="18" rx="3" class="dg-bar-a"/>
<text x="358" y="67" class="dg-t" font-size="11" text-anchor="start">1</text>
<text x="62" y="91" class="dg-t" font-size="11.5" text-anchor="end">chiens</text>
<rect x="70" y="78" width="10.8" height="18" rx="3" class="dg-bar"/>
<text x="196" y="91" class="dg-t" font-size="11" text-anchor="start">0.09</text>
<rect x="232" y="78" width="2" height="18" rx="3" class="dg-bar"/>
<text x="358" y="91" class="dg-t" font-size="11" text-anchor="start">0</text>
<text x="62" y="115" class="dg-t" font-size="11.5" text-anchor="end">les</text>
<rect x="70" y="102" width="4.8" height="18" rx="3" class="dg-bar"/>
<text x="196" y="115" class="dg-t" font-size="11" text-anchor="start">0.04</text>
<rect x="232" y="102" width="2" height="18" rx="3" class="dg-bar"/>
<text x="358" y="115" class="dg-t" font-size="11" text-anchor="start">0</text>
<text x="62" y="139" class="dg-t" font-size="11.5" text-anchor="end">aime</text>
<rect x="70" y="126" width="3.6" height="18" rx="3" class="dg-bar"/>
<text x="196" y="139" class="dg-t" font-size="11" text-anchor="start">0.03</text>
<rect x="232" y="126" width="2" height="18" rx="3" class="dg-bar"/>
<text x="358" y="139" class="dg-t" font-size="11" text-anchor="start">0</text>
<text x="62" y="163" class="dg-t" font-size="11.5" text-anchor="end">&lt;eos&gt;</text>
<rect x="70" y="150" width="2.4" height="18" rx="3" class="dg-bar"/>
<text x="196" y="163" class="dg-t" font-size="11" text-anchor="start">0.02</text>
<rect x="232" y="150" width="2" height="18" rx="3" class="dg-bar"/>
<text x="358" y="163" class="dg-t" font-size="11" text-anchor="start">0</text>
<path d="M20 186H380" class="dg-ld"/>
<rect x="70" y="198" width="260" height="40" rx="6" class="dg-a"/><text x="200" y="217" class="dg-h" font-size="13" text-anchor="middle">L = −log(0.82) ≈ 0.20</text><text x="200" y="232" class="dg-m" font-size="11" text-anchor="middle">only the correct token's probability matters</text>
<path d="M200 242L200 258" class="dg-la" marker-end="url(#fig-loss-b)"/>
<rect x="90" y="260" width="220" height="32" rx="6" class="dg-b"/><text x="200" y="280.5" class="dg-h" font-size="12" text-anchor="middle">backpropagate, update weights</text>
<text x="200" y="316" class="dg-m" font-size="11" text-anchor="middle">With label smoothing (ε = 0.1) the target is not a perfect</text>
<text x="200" y="332" class="dg-m" font-size="11" text-anchor="middle">1 and 0, so a little loss always remains.</text>
</svg>
<figcaption><strong>Figure 14. Only one number in the row counts.</strong> With a one-hot target every other term in the sum is multiplied by zero, so the loss collapses to the negative log probability of the right token. Label smoothing softens that target slightly.</figcaption>
</figure>

## Final Wrap-Up

So after all this talk, why does the Transformer even matter?

Some of its major innovations and advantages included:

- **Self-attention:** Allowing tokens to directly incorporate information from distant positions.
- **Parallelization:** Enabling much more parallel computation during training compared with recurrent architectures.
- **Positional encoding:** Providing sequence-order information without recurrence.
- **Encoder-decoder attention:** Allowing the decoder to incorporate information from the input sequence.
- **Scalability:** Providing an architecture that proved highly effective for larger models and datasets.

One thing to note is that standard self-attention requires $O(n^2)$ attention scores for a sequence of length $n$, making long sequences computationally expensive.

This makes sense when you think back to how attention scores are calculated.

If each token needs an attention score for every other token, we end up with an $n \times n$ attention matrix.

<figure class="diagram figSteps" id="fig-quadratic" aria-label="How the attention matrix grows with sequence length">
<input type="radio" name="fig-quadratic" id="fig-quadratic-1" checked><input type="radio" name="fig-quadratic" id="fig-quadratic-2"><input type="radio" name="fig-quadratic" id="fig-quadratic-3"><input type="radio" name="fig-quadratic" id="fig-quadratic-4">
<div class="stepTabs"><label for="fig-quadratic-1">10 tokens</label><label for="fig-quadratic-2">50 tokens</label><label for="fig-quadratic-3">100 tokens</label><label for="fig-quadratic-4">1000 tokens</label></div>
<div class="stepPanels"><div><svg viewBox="0 0 400 272" role="img" aria-labelledby="fig-quadratic-p1-t fig-quadratic-p1-d"><title id="fig-quadratic-p1-t">10 tokens needs 100 attention scores</title><desc id="fig-quadratic-p1-d">A square grid representing the attention matrix for 10 tokens, which contains 100 scores.</desc><defs><marker id="fig-quadratic-p1-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-quadratic-p1-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="20" class="dg-h" font-size="13" text-anchor="middle">10 tokens</text><text x="200" y="38" class="dg-m" font-size="11" text-anchor="middle">a short sentence</text><rect x="115" y="50" width="170" height="170" rx="3" class="dg-bar-a" opacity="0.45"/><path d="M132.00 50V220M115 67.00H285M149.00 50V220M115 84.00H285M166.00 50V220M115 101.00H285M183.00 50V220M115 118.00H285M200.00 50V220M115 135.00H285M217.00 50V220M115 152.00H285M234.00 50V220M115 169.00H285M251.00 50V220M115 186.00H285M268.00 50V220M115 203.00H285" class="dg-l" stroke-width="0.4" opacity="0.5"/><rect x="115" y="50" width="170" height="170" rx="3" class="dg-b" fill="none"/><text x="200" y="240" class="dg-t" font-size="12.5" text-anchor="middle">10 × 10 = 100 attention scores</text><text x="200" y="260" class="dg-m" font-size="11" text-anchor="middle">the baseline</text></svg></div><div><svg viewBox="0 0 400 272" role="img" aria-labelledby="fig-quadratic-p2-t fig-quadratic-p2-d"><title id="fig-quadratic-p2-t">50 tokens needs 2500 attention scores</title><desc id="fig-quadratic-p2-d">A square grid representing the attention matrix for 50 tokens, which contains 2500 scores.</desc><defs><marker id="fig-quadratic-p2-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-quadratic-p2-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="20" class="dg-h" font-size="13" text-anchor="middle">50 tokens</text><text x="200" y="38" class="dg-m" font-size="11" text-anchor="middle">a long sentence</text><rect x="115" y="50" width="170" height="170" rx="3" class="dg-bar-a" opacity="0.45"/><path d="M121.80 50V220M115 56.80H285M128.60 50V220M115 63.60H285M135.40 50V220M115 70.40H285M142.20 50V220M115 77.20H285M149.00 50V220M115 84.00H285M155.80 50V220M115 90.80H285M162.60 50V220M115 97.60H285M169.40 50V220M115 104.40H285M176.20 50V220M115 111.20H285M183.00 50V220M115 118.00H285M189.80 50V220M115 124.80H285M196.60 50V220M115 131.60H285M203.40 50V220M115 138.40H285M210.20 50V220M115 145.20H285M217.00 50V220M115 152.00H285M223.80 50V220M115 158.80H285M230.60 50V220M115 165.60H285M237.40 50V220M115 172.40H285M244.20 50V220M115 179.20H285M251.00 50V220M115 186.00H285M257.80 50V220M115 192.80H285M264.60 50V220M115 199.60H285M271.40 50V220M115 206.40H285M278.20 50V220M115 213.20H285" class="dg-l" stroke-width="0.4" opacity="0.5"/><rect x="115" y="50" width="170" height="170" rx="3" class="dg-b" fill="none"/><text x="200" y="240" class="dg-t" font-size="12.5" text-anchor="middle">50 × 50 = 2,500 attention scores</text><text x="200" y="260" class="dg-m" font-size="11" text-anchor="middle">25× more than 10 tokens</text></svg></div><div><svg viewBox="0 0 400 272" role="img" aria-labelledby="fig-quadratic-p3-t fig-quadratic-p3-d"><title id="fig-quadratic-p3-t">100 tokens needs 10000 attention scores</title><desc id="fig-quadratic-p3-d">A square grid representing the attention matrix for 100 tokens, which contains 10000 scores.</desc><defs><marker id="fig-quadratic-p3-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-quadratic-p3-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="20" class="dg-h" font-size="13" text-anchor="middle">100 tokens</text><text x="200" y="38" class="dg-m" font-size="11" text-anchor="middle">a paragraph</text><rect x="115" y="50" width="170" height="170" rx="3" class="dg-bar-a" opacity="0.45"/><path d="M120.15 50V220M115 55.15H285M125.30 50V220M115 60.30H285M130.45 50V220M115 65.45H285M135.61 50V220M115 70.61H285M140.76 50V220M115 75.76H285M145.91 50V220M115 80.91H285M151.06 50V220M115 86.06H285M156.21 50V220M115 91.21H285M161.36 50V220M115 96.36H285M166.52 50V220M115 101.52H285M171.67 50V220M115 106.67H285M176.82 50V220M115 111.82H285M181.97 50V220M115 116.97H285M187.12 50V220M115 122.12H285M192.27 50V220M115 127.27H285M197.42 50V220M115 132.42H285M202.58 50V220M115 137.58H285M207.73 50V220M115 142.73H285M212.88 50V220M115 147.88H285M218.03 50V220M115 153.03H285M223.18 50V220M115 158.18H285M228.33 50V220M115 163.33H285M233.48 50V220M115 168.48H285M238.64 50V220M115 173.64H285M243.79 50V220M115 178.79H285M248.94 50V220M115 183.94H285M254.09 50V220M115 189.09H285M259.24 50V220M115 194.24H285M264.39 50V220M115 199.39H285M269.55 50V220M115 204.55H285M274.70 50V220M115 209.70H285M279.85 50V220M115 214.85H285" class="dg-l" stroke-width="0.4" opacity="0.5"/><rect x="115" y="50" width="170" height="170" rx="3" class="dg-b" fill="none"/><text x="200" y="240" class="dg-t" font-size="12.5" text-anchor="middle">100 × 100 = 10,000 attention scores</text><text x="200" y="260" class="dg-m" font-size="11" text-anchor="middle">100× more than 10 tokens</text></svg></div><div><svg viewBox="0 0 400 272" role="img" aria-labelledby="fig-quadratic-p4-t fig-quadratic-p4-d"><title id="fig-quadratic-p4-t">1000 tokens needs 1000000 attention scores</title><desc id="fig-quadratic-p4-d">A square grid representing the attention matrix for 1000 tokens, which contains 1000000 scores.</desc><defs><marker id="fig-quadratic-p4-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-quadratic-p4-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs><text x="200" y="20" class="dg-h" font-size="13" text-anchor="middle">1000 tokens</text><text x="200" y="38" class="dg-m" font-size="11" text-anchor="middle">a short article</text><rect x="115" y="50" width="170" height="170" rx="3" class="dg-bar-a" opacity="0.45"/><path d="M118.40 50V220M115 53.40H285M121.80 50V220M115 56.80H285M125.20 50V220M115 60.20H285M128.60 50V220M115 63.60H285M132.00 50V220M115 67.00H285M135.40 50V220M115 70.40H285M138.80 50V220M115 73.80H285M142.20 50V220M115 77.20H285M145.60 50V220M115 80.60H285M149.00 50V220M115 84.00H285M152.40 50V220M115 87.40H285M155.80 50V220M115 90.80H285M159.20 50V220M115 94.20H285M162.60 50V220M115 97.60H285M166.00 50V220M115 101.00H285M169.40 50V220M115 104.40H285M172.80 50V220M115 107.80H285M176.20 50V220M115 111.20H285M179.60 50V220M115 114.60H285M183.00 50V220M115 118.00H285M186.40 50V220M115 121.40H285M189.80 50V220M115 124.80H285M193.20 50V220M115 128.20H285M196.60 50V220M115 131.60H285M200.00 50V220M115 135.00H285M203.40 50V220M115 138.40H285M206.80 50V220M115 141.80H285M210.20 50V220M115 145.20H285M213.60 50V220M115 148.60H285M217.00 50V220M115 152.00H285M220.40 50V220M115 155.40H285M223.80 50V220M115 158.80H285M227.20 50V220M115 162.20H285M230.60 50V220M115 165.60H285M234.00 50V220M115 169.00H285M237.40 50V220M115 172.40H285M240.80 50V220M115 175.80H285M244.20 50V220M115 179.20H285M247.60 50V220M115 182.60H285M251.00 50V220M115 186.00H285M254.40 50V220M115 189.40H285M257.80 50V220M115 192.80H285M261.20 50V220M115 196.20H285M264.60 50V220M115 199.60H285M268.00 50V220M115 203.00H285M271.40 50V220M115 206.40H285M274.80 50V220M115 209.80H285M278.20 50V220M115 213.20H285M281.60 50V220M115 216.60H285" class="dg-l" stroke-width="0.4" opacity="0.5"/><rect x="115" y="50" width="170" height="170" rx="3" class="dg-b" fill="none"/><text x="200" y="240" class="dg-t" font-size="12.5" text-anchor="middle">1000 × 1000 = 1,000,000 attention scores</text><text x="200" y="260" class="dg-m" font-size="11" text-anchor="middle">10,000× more than 10 tokens</text></svg></div></div>
<figcaption><strong>Figure 15. The cost of looking everywhere.</strong> Every token scores every other token, so the matrix is <em>n</em> × <em>n</em>. Ten times the tokens means a hundred times the scores. The grids are drawn at a fixed size; only the count changes.</figcaption>
</figure>

The number of attention scores grows quadratically with the sequence length.

## References

- Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., and Polosukhin, I. (2017). Attention Is All You Need. *NeurIPS*. [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
- Alammar, J. (2018). The Illustrated Transformer. [jalammar.github.io](https://jalammar.github.io/illustrated-transformer/)
