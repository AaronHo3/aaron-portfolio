---
title: "Reading DDPM: How Predicting Noise Becomes a Way to Make Images"
description: "Notes on the second ML × Bio Reading Club paper: how Denoising Diffusion Probabilistic Models turn a simple task, guessing the noise mixed into an image, into a way to generate new images, and why the best-looking samples did not come with the best likelihood."
date: 2026-10-18
draft: true
tags: [generative-models, imaging, ml]
series: ml-bio-reading-club
paperId: ddpm
paperTitle: "Denoising Diffusion Probabilistic Models"
paperUrl: "https://arxiv.org/abs/2006.11239"
paperAuthors: "Jonathan Ho, Ajay Jain, Pieter Abbeel"
---

<div class="callout" role="note">

*Written from my personal reading notes, with the assistance of Claude.*

</div>

The second paper on the [reading club roadmap](/reading-club) is *Denoising Diffusion Probabilistic Models* by Jonathan Ho, Ajay Jain and Pieter Abbeel (NeurIPS 2020), usually shortened to DDPM. It trains a neural network on a task that sounds too modest to matter: look at an image that has had random noise mixed into it, and guess the noise. Then it uses that same network to produce new images, starting from nothing but noise.

The gap between those two sentences is the question my notes kept circling: **how does predicting noise let a model generate an image?** Noise is random by construction, so it seems like there's nothing meaningful to learn by predicting it. This post works toward an answer, along with two follow-up questions from my notes: why generation adds fresh randomness while it's supposed to be removing noise, and how much of the paper's mathematics you need to see the mechanism. Ideas, equations and results belong to the authors.

## What the model is trying to produce

DDPM is an *unconditional* image model. Trained on a dataset of images (CIFAR-10 at 32×32 pixels, plus CelebA-HQ faces and LSUN scenes at 256×256), it produces new images that look like they came from that dataset, with no text prompt or class label. The paper describes it as a parameterized Markov chain: a sequence of states where each depends only on the one before. The chain starts at random noise, and each learned step makes the state a little more image-like. The bet is that **improving a noisy image slightly is much easier than producing a complete image in one shot**, and that enough slight improvements add up.

Diffusion models weren't invented here; Sohl-Dickstein et al. (2015) introduced them. DDPM showed they could produce high-quality samples, using a simple training recipe.

## First, destroy the data on purpose

Before anything is learned, the paper fixes a *forward process* that gradually corrupts a real image. Pixel values are scaled to the range $[-1, 1]$, and each step shrinks the image slightly and adds a little Gaussian noise:

$$
x_t = \sqrt{1-\beta_t}\,x_{t-1} + \sqrt{\beta_t}\,\epsilon_t, \qquad \epsilon_t \sim \mathcal{N}(0, I)
$$

Here $x_0$ is the clean image, $x_t$ is the image after $t$ steps, and $\beta_t$ is the variance of the noise added at step $t$. With $\beta_t = 0.01$, the step multiplies the image by $\sqrt{0.99} \approx 0.995$ and adds noise with standard deviation $0.1$. The shrinking keeps the scale fixed: a value with variance 1 still has variance $(1-\beta_t) + \beta_t = 1$ afterward. The paper uses $T = 1000$ steps, with $\beta_t$ rising linearly from $10^{-4}$ to $0.02$. Nothing here is learned.

Running a thousand steps per training example would be slow, but adding Gaussian noise to Gaussian noise gives Gaussian noise, so all $t$ steps collapse into one:

$$
x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\epsilon, \qquad \epsilon \sim \mathcal{N}(0, I)
$$

where $\alpha_t = 1 - \beta_t$ and $\bar\alpha_t = \alpha_1\alpha_2\cdots\alpha_t$ is the product of every $\alpha_s$ up to step $t$. Read the coefficients as dials: $\sqrt{\bar\alpha_t}$ is how much of the original image survives, and $\sqrt{1-\bar\alpha_t}$ is how much noise there is. Under the paper's schedule they're about 0.72 and 0.69 at $t = 250$, 0.28 and 0.96 at $t = 500$, and the image is down to 0.006 at $t = 1000$. This is what lets training jump straight to any noise level without building the states in between.

Two details matter later. $\epsilon$ is the **aggregate** noise, one draw standing in for all $t$ steps combined, not the last step's increment. And $t$ isn't elapsed time; it's an index into the noise schedule, a label for how corrupted the image is.

<figure class="diagram" id="fig-chain">
<svg viewBox="0 0 400 340" role="img" aria-labelledby="fig-chain-title fig-chain-desc">
<title id="fig-chain-title">The fixed forward process and the learned reverse process</title>
<desc id="fig-chain-desc">Two rows of 8 by 8 toy images. Top row, the forward process: a real training image of a smiley face gets noisier from left to right, through x t at t equals 250, where signal and noise have similar weight, to x T at t equals 1000, which is almost pure noise. The arrows are fixed noising steps with nothing learned. Bottom row, the reverse process: generation starts from a new random noise draw on the right and moves left through learned denoising steps to a house shape, an image that was not in the forward row or the dataset.</desc>
<defs><marker id="fig-chain-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-chain-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="10" y="18" class="dg-h" font-size="14" text-anchor="start">Forward process q: fixed, nothing learned</text>
<text x="10" y="35" class="dg-m" font-size="12.5" text-anchor="start">starts from a real training image</text>
<rect x="24" y="46" width="72" height="72" rx="4" class="dg-b"/><rect x="42" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="55" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="55" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="24" y="64" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="64" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="64" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="87" y="64" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="24" y="73" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="87" y="73" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="24" y="82" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="82" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="82" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="87" y="82" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="24" y="91" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="91" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="91" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="87" y="91" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="100" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="100" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="109" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="109" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="109" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="109" width="9" height="9" class="dg-bar-a" opacity="1.00"/>
<rect x="164" y="46" width="72" height="72" rx="4" class="dg-b"/><rect x="182" y="46" width="9" height="9" class="dg-bar-a" opacity="0.74"/><rect x="191" y="46" width="9" height="9" class="dg-bar-a" opacity="0.61"/><rect x="200" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="209" y="46" width="9" height="9" class="dg-bar-a" opacity="0.93"/><rect x="218" y="46" width="9" height="9" class="dg-bar-a" opacity="0.37"/><rect x="227" y="46" width="9" height="9" class="dg-bar-a" opacity="0.37"/><rect x="173" y="55" width="9" height="9" class="dg-bar-a" opacity="0.94"/><rect x="182" y="55" width="9" height="9" class="dg-bar-a" opacity="0.27"/><rect x="191" y="55" width="9" height="9" class="dg-bar-a" opacity="0.39"/><rect x="200" y="55" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="218" y="55" width="9" height="9" class="dg-bar-a" opacity="0.87"/><rect x="173" y="64" width="9" height="9" class="dg-bar-a" opacity="0.84"/><rect x="182" y="64" width="9" height="9" class="dg-bar-a" opacity="0.90"/><rect x="191" y="64" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="200" y="64" width="9" height="9" class="dg-bar-a" opacity="0.92"/><rect x="209" y="64" width="9" height="9" class="dg-bar-a" opacity="0.99"/><rect x="218" y="64" width="9" height="9" class="dg-bar-a" opacity="0.43"/><rect x="227" y="64" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="164" y="73" width="9" height="9" class="dg-bar-a" opacity="0.66"/><rect x="173" y="73" width="9" height="9" class="dg-bar-a" opacity="0.24"/><rect x="182" y="73" width="9" height="9" class="dg-bar-a" opacity="0.42"/><rect x="200" y="73" width="9" height="9" class="dg-bar-a" opacity="0.52"/><rect x="209" y="73" width="9" height="9" class="dg-bar-a" opacity="0.24"/><rect x="227" y="73" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="164" y="82" width="9" height="9" class="dg-bar-a" opacity="0.61"/><rect x="173" y="82" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="182" y="82" width="9" height="9" class="dg-bar-a" opacity="0.38"/><rect x="191" y="82" width="9" height="9" class="dg-bar-a" opacity="0.29"/><rect x="209" y="82" width="9" height="9" class="dg-bar-a" opacity="0.49"/><rect x="218" y="82" width="9" height="9" class="dg-bar-a" opacity="0.06"/><rect x="227" y="82" width="9" height="9" class="dg-bar-a" opacity="0.90"/><rect x="164" y="91" width="9" height="9" class="dg-bar-a" opacity="0.55"/><rect x="173" y="91" width="9" height="9" class="dg-bar-a" opacity="0.52"/><rect x="182" y="91" width="9" height="9" class="dg-bar-a" opacity="0.40"/><rect x="191" y="91" width="9" height="9" class="dg-bar-a" opacity="0.97"/><rect x="200" y="91" width="9" height="9" class="dg-bar-a" opacity="0.45"/><rect x="209" y="91" width="9" height="9" class="dg-bar-a" opacity="0.40"/><rect x="218" y="91" width="9" height="9" class="dg-bar-a" opacity="0.56"/><rect x="227" y="91" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="164" y="100" width="9" height="9" class="dg-bar-a" opacity="0.42"/><rect x="173" y="100" width="9" height="9" class="dg-bar-a" opacity="0.92"/><rect x="182" y="100" width="9" height="9" class="dg-bar-a" opacity="0.06"/><rect x="200" y="100" width="9" height="9" class="dg-bar-a" opacity="0.42"/><rect x="209" y="100" width="9" height="9" class="dg-bar-a" opacity="0.41"/><rect x="218" y="100" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="227" y="100" width="9" height="9" class="dg-bar-a" opacity="0.48"/><rect x="173" y="109" width="9" height="9" class="dg-bar-a" opacity="0.06"/><rect x="182" y="109" width="9" height="9" class="dg-bar-a" opacity="0.68"/><rect x="191" y="109" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="200" y="109" width="9" height="9" class="dg-bar-a" opacity="0.69"/><rect x="209" y="109" width="9" height="9" class="dg-bar-a" opacity="0.35"/>
<rect x="304" y="46" width="72" height="72" rx="4" class="dg-b"/><rect x="304" y="46" width="9" height="9" class="dg-bar-a" opacity="0.89"/><rect x="313" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="322" y="46" width="9" height="9" class="dg-bar-a" opacity="0.14"/><rect x="331" y="46" width="9" height="9" class="dg-bar-a" opacity="0.82"/><rect x="349" y="46" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="358" y="46" width="9" height="9" class="dg-bar-a" opacity="0.09"/><rect x="367" y="46" width="9" height="9" class="dg-bar-a" opacity="0.74"/><rect x="304" y="55" width="9" height="9" class="dg-bar-a" opacity="0.22"/><rect x="313" y="55" width="9" height="9" class="dg-bar-a" opacity="0.13"/><rect x="322" y="55" width="9" height="9" class="dg-bar-a" opacity="0.78"/><rect x="331" y="55" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="340" y="55" width="9" height="9" class="dg-bar-a" opacity="0.40"/><rect x="349" y="55" width="9" height="9" class="dg-bar-a" opacity="0.52"/><rect x="358" y="55" width="9" height="9" class="dg-bar-a" opacity="0.36"/><rect x="304" y="64" width="9" height="9" class="dg-bar-a" opacity="0.91"/><rect x="322" y="64" width="9" height="9" class="dg-bar-a" opacity="0.29"/><rect x="331" y="64" width="9" height="9" class="dg-bar-a" opacity="0.60"/><rect x="340" y="64" width="9" height="9" class="dg-bar-a" opacity="0.05"/><rect x="358" y="64" width="9" height="9" class="dg-bar-a" opacity="0.79"/><rect x="313" y="73" width="9" height="9" class="dg-bar-a" opacity="0.72"/><rect x="322" y="73" width="9" height="9" class="dg-bar-a" opacity="0.18"/><rect x="331" y="73" width="9" height="9" class="dg-bar-a" opacity="0.36"/><rect x="340" y="73" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="349" y="73" width="9" height="9" class="dg-bar-a" opacity="0.44"/><rect x="358" y="73" width="9" height="9" class="dg-bar-a" opacity="0.92"/><rect x="367" y="73" width="9" height="9" class="dg-bar-a" opacity="0.85"/><rect x="313" y="82" width="9" height="9" class="dg-bar-a" opacity="0.35"/><rect x="322" y="82" width="9" height="9" class="dg-bar-a" opacity="0.37"/><rect x="340" y="82" width="9" height="9" class="dg-bar-a" opacity="0.09"/><rect x="349" y="82" width="9" height="9" class="dg-bar-a" opacity="0.68"/><rect x="358" y="82" width="9" height="9" class="dg-bar-a" opacity="0.40"/><rect x="367" y="82" width="9" height="9" class="dg-bar-a" opacity="0.55"/><rect x="313" y="91" width="9" height="9" class="dg-bar-a" opacity="0.15"/><rect x="322" y="91" width="9" height="9" class="dg-bar-a" opacity="0.24"/><rect x="331" y="91" width="9" height="9" class="dg-bar-a" opacity="0.59"/><rect x="340" y="91" width="9" height="9" class="dg-bar-a" opacity="0.42"/><rect x="349" y="91" width="9" height="9" class="dg-bar-a" opacity="0.73"/><rect x="358" y="91" width="9" height="9" class="dg-bar-a" opacity="0.37"/><rect x="367" y="91" width="9" height="9" class="dg-bar-a" opacity="0.96"/><rect x="322" y="100" width="9" height="9" class="dg-bar-a" opacity="0.47"/><rect x="331" y="100" width="9" height="9" class="dg-bar-a" opacity="0.74"/><rect x="340" y="100" width="9" height="9" class="dg-bar-a" opacity="0.74"/><rect x="349" y="100" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="367" y="100" width="9" height="9" class="dg-bar-a" opacity="0.25"/><rect x="304" y="109" width="9" height="9" class="dg-bar-a" opacity="0.44"/><rect x="313" y="109" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="331" y="109" width="9" height="9" class="dg-bar-a" opacity="0.73"/><rect x="340" y="109" width="9" height="9" class="dg-bar-a" opacity="0.66"/><rect x="349" y="109" width="9" height="9" class="dg-bar-a" opacity="0.86"/><rect x="367" y="109" width="9" height="9" class="dg-bar-a" opacity="0.11"/>
<path d="M100 82L160 82" class="dg-l" marker-end="url(#fig-chain-arr)"/>
<text x="130" y="74" class="dg-m" font-size="11.5" text-anchor="middle">add noise</text>
<text x="130" y="97" class="dg-m" font-size="11.5" text-anchor="middle">many steps</text>
<path d="M240 82L300 82" class="dg-l" marker-end="url(#fig-chain-arr)"/>
<text x="270" y="74" class="dg-m" font-size="11.5" text-anchor="middle">add noise</text>
<text x="270" y="97" class="dg-m" font-size="11.5" text-anchor="middle">many steps</text>
<text x="60" y="136" class="dg-t" font-size="12.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">0</tspan><tspan dy="-3">: real image</tspan></text>
<text x="200" y="136" class="dg-t" font-size="12.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">t</tspan><tspan dy="-3">, t = 250</tspan></text>
<text x="340" y="136" class="dg-t" font-size="12.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">T</tspan><tspan dy="-3">, T = 1000</tspan></text>
<text x="60" y="152" class="dg-m" font-size="11.5" text-anchor="middle">from the dataset</text>
<text x="200" y="152" class="dg-m" font-size="11.5" text-anchor="middle">signal 0.72, noise 0.69</text>
<text x="340" y="152" class="dg-m" font-size="11.5" text-anchor="middle">almost pure noise</text>
<path d="M10 170H390" class="dg-ld"/>
<text x="10" y="194" class="dg-h" font-size="14" text-anchor="start">Reverse process p<tspan dy="3" font-size="0.75em">θ</tspan><tspan dy="-3">: learned, one network</tspan></text>
<text x="10" y="211" class="dg-m" font-size="12.5" text-anchor="start">starts from newly sampled noise</text>
<rect x="24" y="222" width="72" height="72" rx="4" class="dg-b"/><rect x="51" y="222" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="222" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="24" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="87" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="258" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="258" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="267" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="267" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="267" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="267" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="33" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="42" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="51" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="60" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="69" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="78" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/>
<rect x="164" y="222" width="72" height="72" rx="4" class="dg-b"/><rect x="164" y="222" width="9" height="9" class="dg-bar-a" opacity="0.18"/><rect x="191" y="222" width="9" height="9" class="dg-bar-a" opacity="0.59"/><rect x="200" y="222" width="9" height="9" class="dg-bar-a" opacity="0.88"/><rect x="209" y="222" width="9" height="9" class="dg-bar-a" opacity="0.12"/><rect x="218" y="222" width="9" height="9" class="dg-bar-a" opacity="0.45"/><rect x="164" y="231" width="9" height="9" class="dg-bar-a" opacity="0.10"/><rect x="173" y="231" width="9" height="9" class="dg-bar-a" opacity="0.10"/><rect x="182" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="191" y="231" width="9" height="9" class="dg-bar-a" opacity="0.92"/><rect x="200" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="209" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="218" y="231" width="9" height="9" class="dg-bar-a" opacity="0.64"/><rect x="227" y="231" width="9" height="9" class="dg-bar-a" opacity="0.06"/><rect x="164" y="240" width="9" height="9" class="dg-bar-a" opacity="0.60"/><rect x="173" y="240" width="9" height="9" class="dg-bar-a" opacity="0.44"/><rect x="182" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="191" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="200" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="209" y="240" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="218" y="240" width="9" height="9" class="dg-bar-a" opacity="0.57"/><rect x="227" y="240" width="9" height="9" class="dg-bar-a" opacity="0.23"/><rect x="164" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="173" y="249" width="9" height="9" class="dg-bar-a" opacity="0.79"/><rect x="182" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="191" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="200" y="249" width="9" height="9" class="dg-bar-a" opacity="0.82"/><rect x="209" y="249" width="9" height="9" class="dg-bar-a" opacity="0.88"/><rect x="218" y="249" width="9" height="9" class="dg-bar-a" opacity="0.89"/><rect x="227" y="249" width="9" height="9" class="dg-bar-a" opacity="0.58"/><rect x="164" y="258" width="9" height="9" class="dg-bar-a" opacity="0.82"/><rect x="173" y="258" width="9" height="9" class="dg-bar-a" opacity="0.59"/><rect x="182" y="258" width="9" height="9" class="dg-bar-a" opacity="0.66"/><rect x="191" y="258" width="9" height="9" class="dg-bar-a" opacity="0.06"/><rect x="200" y="258" width="9" height="9" class="dg-bar-a" opacity="0.11"/><rect x="209" y="258" width="9" height="9" class="dg-bar-a" opacity="0.38"/><rect x="218" y="258" width="9" height="9" class="dg-bar-a" opacity="0.69"/><rect x="227" y="258" width="9" height="9" class="dg-bar-a" opacity="0.11"/><rect x="164" y="267" width="9" height="9" class="dg-bar-a" opacity="0.43"/><rect x="173" y="267" width="9" height="9" class="dg-bar-a" opacity="0.33"/><rect x="182" y="267" width="9" height="9" class="dg-bar-a" opacity="0.13"/><rect x="191" y="267" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="200" y="267" width="9" height="9" class="dg-bar-a" opacity="0.50"/><rect x="218" y="267" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="227" y="267" width="9" height="9" class="dg-bar-a" opacity="0.66"/><rect x="173" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="182" y="276" width="9" height="9" class="dg-bar-a" opacity="0.36"/><rect x="191" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="200" y="276" width="9" height="9" class="dg-bar-a" opacity="0.46"/><rect x="218" y="276" width="9" height="9" class="dg-bar-a" opacity="0.81"/><rect x="227" y="276" width="9" height="9" class="dg-bar-a" opacity="0.38"/><rect x="164" y="285" width="9" height="9" class="dg-bar-a" opacity="0.32"/><rect x="173" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="182" y="285" width="9" height="9" class="dg-bar-a" opacity="0.36"/><rect x="191" y="285" width="9" height="9" class="dg-bar-a" opacity="0.38"/><rect x="200" y="285" width="9" height="9" class="dg-bar-a" opacity="0.85"/><rect x="209" y="285" width="9" height="9" class="dg-bar-a" opacity="0.88"/><rect x="218" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/>
<rect x="304" y="222" width="72" height="72" rx="4" class="dg-b"/><rect x="304" y="222" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="313" y="222" width="9" height="9" class="dg-bar-a" opacity="0.63"/><rect x="322" y="222" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="331" y="222" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="340" y="222" width="9" height="9" class="dg-bar-a" opacity="0.53"/><rect x="349" y="222" width="9" height="9" class="dg-bar-a" opacity="0.36"/><rect x="358" y="222" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="367" y="222" width="9" height="9" class="dg-bar-a" opacity="0.63"/><rect x="313" y="231" width="9" height="9" class="dg-bar-a" opacity="0.71"/><rect x="322" y="231" width="9" height="9" class="dg-bar-a" opacity="0.58"/><rect x="331" y="231" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="340" y="231" width="9" height="9" class="dg-bar-a" opacity="0.78"/><rect x="349" y="231" width="9" height="9" class="dg-bar-a" opacity="0.90"/><rect x="358" y="231" width="9" height="9" class="dg-bar-a" opacity="0.63"/><rect x="304" y="240" width="9" height="9" class="dg-bar-a" opacity="0.27"/><rect x="313" y="240" width="9" height="9" class="dg-bar-a" opacity="0.93"/><rect x="331" y="240" width="9" height="9" class="dg-bar-a" opacity="0.90"/><rect x="340" y="240" width="9" height="9" class="dg-bar-a" opacity="0.88"/><rect x="349" y="240" width="9" height="9" class="dg-bar-a" opacity="0.13"/><rect x="358" y="240" width="9" height="9" class="dg-bar-a" opacity="0.99"/><rect x="367" y="240" width="9" height="9" class="dg-bar-a" opacity="0.59"/><rect x="304" y="249" width="9" height="9" class="dg-bar-a" opacity="0.08"/><rect x="313" y="249" width="9" height="9" class="dg-bar-a" opacity="0.96"/><rect x="322" y="249" width="9" height="9" class="dg-bar-a" opacity="0.31"/><rect x="331" y="249" width="9" height="9" class="dg-bar-a" opacity="0.24"/><rect x="358" y="249" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="367" y="249" width="9" height="9" class="dg-bar-a" opacity="0.94"/><rect x="322" y="258" width="9" height="9" class="dg-bar-a" opacity="0.37"/><rect x="331" y="258" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="340" y="258" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="349" y="258" width="9" height="9" class="dg-bar-a" opacity="0.31"/><rect x="358" y="258" width="9" height="9" class="dg-bar-a" opacity="0.82"/><rect x="304" y="267" width="9" height="9" class="dg-bar-a" opacity="0.40"/><rect x="313" y="267" width="9" height="9" class="dg-bar-a" opacity="0.86"/><rect x="322" y="267" width="9" height="9" class="dg-bar-a" opacity="0.76"/><rect x="340" y="267" width="9" height="9" class="dg-bar-a" opacity="0.42"/><rect x="349" y="267" width="9" height="9" class="dg-bar-a" opacity="0.92"/><rect x="358" y="267" width="9" height="9" class="dg-bar-a" opacity="0.63"/><rect x="313" y="276" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="331" y="276" width="9" height="9" class="dg-bar-a" opacity="0.45"/><rect x="340" y="276" width="9" height="9" class="dg-bar-a" opacity="0.90"/><rect x="349" y="276" width="9" height="9" class="dg-bar-a" opacity="0.95"/><rect x="358" y="276" width="9" height="9" class="dg-bar-a" opacity="0.30"/><rect x="367" y="276" width="9" height="9" class="dg-bar-a" opacity="0.65"/><rect x="304" y="285" width="9" height="9" class="dg-bar-a" opacity="0.35"/><rect x="313" y="285" width="9" height="9" class="dg-bar-a" opacity="0.92"/><rect x="322" y="285" width="9" height="9" class="dg-bar-a" opacity="1.00"/><rect x="331" y="285" width="9" height="9" class="dg-bar-a" opacity="0.17"/><rect x="349" y="285" width="9" height="9" class="dg-bar-a" opacity="0.90"/><rect x="358" y="285" width="9" height="9" class="dg-bar-a" opacity="0.20"/><rect x="367" y="285" width="9" height="9" class="dg-bar-a" opacity="0.41"/>
<path d="M300 258L240 258" class="dg-la" marker-end="url(#fig-chain-arr-a)"/>
<text x="270" y="250" class="dg-t" font-size="11.5" text-anchor="middle">denoise</text>
<text x="270" y="273" class="dg-m" font-size="11.5" text-anchor="middle">many steps</text>
<path d="M160 258L100 258" class="dg-la" marker-end="url(#fig-chain-arr-a)"/>
<text x="130" y="250" class="dg-t" font-size="11.5" text-anchor="middle">denoise</text>
<text x="130" y="273" class="dg-m" font-size="11.5" text-anchor="middle">many steps</text>
<text x="60" y="312" class="dg-t" font-size="12.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">0</tspan><tspan dy="-3">: new sample</tspan></text>
<text x="200" y="312" class="dg-t" font-size="12.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">t</tspan></text>
<text x="340" y="312" class="dg-t" font-size="12.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">T</tspan><tspan dy="-3"> ~ N(0, I)</tspan></text>
<text x="60" y="328" class="dg-m" font-size="11.5" text-anchor="middle">not in the dataset</text>
<text x="340" y="328" class="dg-m" font-size="11.5" text-anchor="middle">a fresh random draw</text>
</svg>
<figcaption><strong>Figure 1. Two processes, run in opposite directions.</strong> Top: the forward process corrupts a real image with a fixed recipe. Bottom: generation starts from <em>new</em> noise and applies learned denoising steps, ending at a new image rather than recovering one from the training set. Conceptual illustration: 8×8 toy patterns noised with the paper’s schedule, not output from a trained model.</figcaption>
</figure>

## A supervised problem that labels itself

The shortcut makes training simple. Take a real image $x_0$, pick a timestep $t$ uniformly between 1 and $T$, sample noise $\epsilon$, and build $x_t$. Then give $x_t$ and $t$ to a network $\epsilon_\theta$ and ask it to output the noise. The paper's simplified loss is the squared error:

$$
L_\text{simple} = \mathbb{E}_{x_0,\,t,\,\epsilon}\Big[\, \big\| \epsilon - \epsilon_\theta(x_t, t) \big\|^2 \,\Big]
$$

Everything here is our own construction. We made the input $x_t$ and chose $t$, and the target $\epsilon$ is noise we sampled ourselves, so no person labels anything. Only $\theta$, the network's weights, is updated. The output has the image's shape: one noise estimate per pixel channel.

One network, a U-Net with 35.7 million parameters for CIFAR-10, handles every noise level. It receives $t$ as a sinusoidal embedding, the kind of position encoding Transformers use, because denoising a nearly clean image and denoising near-static are very different problems.

<div class="callout" role="note">

**The network can't actually recover the exact noise.** At low noise it nearly can, but at high noise many combinations of image and noise could have produced the same $x_t$. Squared error handles this gracefully: the prediction that minimizes it is the *average* noise over every way $x_t$ could have arisen, $\mathbb{E}[\epsilon \mid x_t]$. At low noise that average needs fine local corrections; at high noise it can only come from broad patterns learned from the dataset.

</div>

<figure class="diagram" id="fig-procedures">
<svg viewBox="0 0 400 512" role="img" aria-labelledby="fig-procedures-title fig-procedures-desc">
<title id="fig-procedures-title">Training and generation use the same network in different procedures</title>
<desc id="fig-procedures-desc">Top panel, training. Three inputs: a real image x 0, a timestep t drawn uniformly from 1 to T, and noise epsilon drawn from a standard Gaussian. They are mixed into a noisy image x t. The network epsilon theta receives x t and t and outputs predicted noise. The sampled epsilon, which we already know, is the target. The loss is the squared difference between them, and one gradient step updates theta. Bottom panel, generation. Start from new noise x T, apply a reverse step (network, then compute the next, less noisy state) in a loop for t equals T down to 1, and end at a new image x 0. Each step needs the previous output, so the 1,000 calls run in sequence.</desc>
<defs><marker id="fig-procedures-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-procedures-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<text x="10" y="18" class="dg-h" font-size="14" text-anchor="start">Training: one random noise level per example</text>
<rect x="10" y="30" width="120" height="42" rx="8" class="dg-b"/>
<text x="70" y="47" class="dg-t" font-size="13" text-anchor="middle">x<tspan dy="3" font-size="0.75em">0</tspan></text>
<text x="70" y="64" class="dg-m" font-size="11.5" text-anchor="middle">a real image</text>
<rect x="140" y="30" width="120" height="42" rx="8" class="dg-b"/>
<text x="200" y="47" class="dg-t" font-size="13" text-anchor="middle">t ~ uniform</text>
<text x="200" y="64" class="dg-m" font-size="11.5" text-anchor="middle">a noise level, 1 to T</text>
<rect x="270" y="30" width="120" height="42" rx="8" class="dg-w"/>
<text x="330" y="47" class="dg-t" font-size="13" text-anchor="middle">ε ~ N(0, I)</text>
<text x="330" y="64" class="dg-m" font-size="11.5" text-anchor="middle">noise we sample</text>
<path d="M70 74L70 94" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<path d="M200 74L200 94" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<path d="M330 74L330 94" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<rect x="10" y="96" width="380" height="34" rx="8" class="dg-b"/>
<text x="200" y="117.5" class="dg-t" font-size="13" text-anchor="middle">mix: x<tspan dy="3" font-size="0.75em">t</tspan><tspan dy="-3"> = scaled image + scaled noise</tspan></text>
<path d="M200 132L200 150" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<rect x="10" y="152" width="380" height="36" rx="8" class="dg-a"/>
<text x="200" y="174.5" class="dg-h" font-size="13.5" text-anchor="middle">network ε<tspan dy="3" font-size="0.75em">θ</tspan><tspan dy="-3">(</tspan>x<tspan dy="3" font-size="0.75em">t</tspan><tspan dy="-3">, t)</tspan></text>
<path d="M100 190L100 210" class="dg-la" marker-end="url(#fig-procedures-arr-a)"/>
<rect x="10" y="212" width="180" height="34" rx="8" class="dg-b"/>
<text x="100" y="233.5" class="dg-t" font-size="13" text-anchor="middle">predicted noise</text>
<path d="M390 51H396V229H393" class="dg-ld" marker-end="url(#fig-procedures-arr)"/>
<rect x="210" y="212" width="180" height="34" rx="8" class="dg-w"/>
<text x="300" y="233.5" class="dg-t" font-size="13" text-anchor="middle">target: the same ε</text>
<path d="M100 248L100 266" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<path d="M300 248L300 266" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<rect x="10" y="268" width="380" height="42" rx="8" class="dg-a"/>
<text x="200" y="285" class="dg-h" font-size="13.5" text-anchor="middle">loss = ‖ ε − predicted noise ‖²</text>
<text x="200" y="302" class="dg-t" font-size="12" text-anchor="middle">one gradient step on θ, then a new image, t and ε</text>
<path d="M10 328H390" class="dg-ld"/>
<text x="10" y="352" class="dg-h" font-size="14" text-anchor="start">Generation: 1,000 network calls in sequence</text>
<rect x="10" y="406" width="92" height="56" rx="8" class="dg-w"/>
<text x="56" y="430" class="dg-t" font-size="13" text-anchor="middle">x<tspan dy="3" font-size="0.75em">T</tspan></text>
<text x="56" y="447" class="dg-m" font-size="11.5" text-anchor="middle">new noise</text>
<path d="M104 434L124 434" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<rect x="126" y="406" width="164" height="56" rx="8" class="dg-a"/>
<text x="208" y="423.5" class="dg-h" font-size="13" text-anchor="middle">reverse step</text>
<text x="208" y="438.5" class="dg-t" font-size="11.5" text-anchor="middle">network, then compute</text>
<text x="208" y="453.5" class="dg-t" font-size="11.5" text-anchor="middle">the next, less noisy state</text>
<path d="M250 404C250 378 166 378 166 400" class="dg-la" marker-end="url(#fig-procedures-arr-a)"/>
<text x="208" y="376" class="dg-t" font-size="11.5" text-anchor="middle">repeat for t = T, …, 1</text>
<path d="M292 434L312 434" class="dg-l" marker-end="url(#fig-procedures-arr)"/>
<rect x="314" y="406" width="76" height="56" rx="8" class="dg-a"/>
<text x="352" y="430" class="dg-t" font-size="13" text-anchor="middle">x<tspan dy="3" font-size="0.75em">0</tspan></text>
<text x="352" y="447" class="dg-m" font-size="11.5" text-anchor="middle">new image</text>
<text x="200" y="486" class="dg-m" font-size="12" text-anchor="middle">Each step needs the previous step’s output,</text>
<text x="200" y="502" class="dg-m" font-size="12" text-anchor="middle">so the 1,000 calls cannot run in parallel.</text>
</svg>
<figcaption><strong>Figure 2. Same network, two procedures.</strong> Training (top) never chains steps: each example jumps straight to one random noise level, and the target is noise we sampled ourselves, so no labels are needed. Generation (bottom) has no clean image and no known noise. It chains the network’s predictions, one timestep at a time. Based on Algorithms 1 and 2 of Ho et al. (2020).</figcaption>
</figure>

## From a noise guess to a step backward

Generation needs something the noise estimator doesn't directly provide: a rule for going from $x_t$ to a slightly cleaner $x_{t-1}$. DDPM models each backward step as a *conditional Gaussian*, one whose center depends on the current input:

$$
p_\theta(x_{t-1} \mid x_t) = \mathcal{N}\big(x_{t-1};\ \mu_\theta(x_t, t),\ \sigma_t^2 I\big)
$$

Given the current noisy image, the next state is drawn from a bell curve centered at $\mu_\theta(x_t, t)$ with spread $\sigma_t$. A Gaussian is reasonable because each forward step adds only a little noise, and undoing a small step is approximately Gaussian too.

DDPM fixes the spread in advance ($\sigma_t^2 = \beta_t$; an alternative gave similar results), so learning a reverse step means learning its center. Here noise prediction pays off. If we knew the clean image, the exact backward step from $x_t$ would be a known Gaussian whose center can be written in terms of $x_t$ and the aggregate noise $\epsilon$. At generation time we plug in the network's estimate instead:

$$
\mu_\theta(x_t, t) = \frac{1}{\sqrt{\alpha_t}}\left( x_t - \frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\epsilon_\theta(x_t, t) \right)
$$

Reading from the inside out: subtract a small fraction of the predicted noise, then divide by $\sqrt{\alpha_t}$ to undo the forward step's shrinking. The fraction $\beta_t/\sqrt{1-\bar\alpha_t}$ is under 2% at every step of the paper's schedule, so a step removes one step's worth of noise, not all of it.

This is also why noise prediction and mean prediction aren't different kinds of model. The mean is a fixed function of $x_t$ and the noise estimate, so they're two parameterizations of the same reverse step. The authors compared them and found noise prediction worked best, especially with the simplified loss.

<details>
<summary>Where the mean formula comes from</summary>

Given both $x_t$ and the clean image $x_0$, the forward process's step backward has a closed form:

$$
q(x_{t-1} \mid x_t, x_0) = \mathcal{N}\big(x_{t-1};\ \tilde\mu_t,\ \tilde\beta_t I\big), \qquad
\tilde\mu_t = \frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}\,x_0 + \frac{\sqrt{\alpha_t}\,(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\,x_t
$$

with $\tilde\beta_t = \frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t$. The direct noising equation can be solved for the clean image, $x_0 = \big(x_t - \sqrt{1-\bar\alpha_t}\,\epsilon\big)/\sqrt{\bar\alpha_t}$. Substituting that into $\tilde\mu_t$ and simplifying gives

$$
\tilde\mu_t = \frac{1}{\sqrt{\alpha_t}}\left( x_t - \frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\epsilon \right)
$$

DDPM's reverse mean is this expression with $\epsilon$ replaced by $\epsilon_\theta(x_t, t)$. The two variance choices the paper tests, $\sigma_t^2 = \beta_t$ and $\sigma_t^2 = \tilde\beta_t$, are the two extremes it describes as upper and lower bounds on the reverse process's entropy.

</details>

## Generating: start from noise, and keep adding a little

Generation (the paper's Algorithm 2) is now short. Sample $x_T$ by filling every pixel channel with an independent draw from $\mathcal{N}(0, 1)$. Then, for $t = T, T-1, \dots, 1$:

$$
x_{t-1} = \frac{1}{\sqrt{\alpha_t}}\left( x_t - \frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\epsilon_\theta(x_t, t) \right) + \sigma_t z
$$

where $z \sim \mathcal{N}(0, I)$ is fresh noise for every step except the last, where $z = 0$. The first term is the reverse mean from the previous section. The second term is the part my notes questioned directly: **why add noise while removing noise?**

<figure class="diagram" id="fig-step">
<svg viewBox="0 0 400 370" role="img" aria-labelledby="fig-step-title fig-step-desc">
<title id="fig-step-title">Anatomy of one reverse step</title>
<desc id="fig-step-desc">Five boxes from top to bottom. The current noisy state x t goes into the network, which outputs predicted noise epsilon theta of x t and t, an estimate of all the noise mixed into the state. A fixed formula turns that prediction into the reverse mean by removing a fraction of the predicted noise and rescaling. Fresh Gaussian noise z, scaled by sigma t, is added; z is set to zero at the final step. The result is x t minus 1, the next, less noisy state, which becomes the input to the next step.</desc>
<defs><marker id="fig-step-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mk"/></marker><marker id="fig-step-arr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dg-mka"/></marker></defs>
<rect x="10" y="10" width="188" height="54" rx="8" class="dg-b"/>
<text x="104" y="33" class="dg-h" font-size="13.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">t</tspan><tspan dy="-3"></tspan></text>
<text x="104" y="50" class="dg-m" font-size="11.5" text-anchor="middle">current noisy state</text>
<path d="M104 66L104 82" class="dg-l" marker-end="url(#fig-step-arr)"/>
<path d="M204 37H214" class="dg-ld"/>
<text x="220" y="34" class="dg-t" font-size="12" text-anchor="start">the input to this step,</text>
<text x="220" y="50" class="dg-m" font-size="12" text-anchor="start">at noise level t</text>
<rect x="10" y="84" width="188" height="54" rx="8" class="dg-a"/>
<text x="104" y="107" class="dg-h" font-size="13.5" text-anchor="middle">ε<tspan dy="3" font-size="0.75em">θ</tspan><tspan dy="-3">(</tspan>x<tspan dy="3" font-size="0.75em">t</tspan><tspan dy="-3">, t)</tspan></text>
<text x="104" y="124" class="dg-m" font-size="11.5" text-anchor="middle">predicted noise</text>
<path d="M104 140L104 156" class="dg-l" marker-end="url(#fig-step-arr)"/>
<path d="M204 111H214" class="dg-ld"/>
<text x="220" y="108" class="dg-t" font-size="12" text-anchor="start">an estimate of all the</text>
<text x="220" y="124" class="dg-m" font-size="12" text-anchor="start">noise mixed into this state</text>
<rect x="10" y="158" width="188" height="54" rx="8" class="dg-b"/>
<text x="104" y="181" class="dg-h" font-size="13.5" text-anchor="middle">reverse mean</text>
<text x="104" y="198" class="dg-m" font-size="11.5" text-anchor="middle">remove a fraction, rescale</text>
<path d="M104 214L104 230" class="dg-l" marker-end="url(#fig-step-arr)"/>
<path d="M204 185H214" class="dg-ld"/>
<text x="220" y="182" class="dg-t" font-size="12" text-anchor="start">fixed formula, no learning;</text>
<text x="220" y="198" class="dg-m" font-size="12" text-anchor="start">the center of the next step</text>
<rect x="10" y="232" width="188" height="54" rx="8" class="dg-w"/>
<text x="104" y="255" class="dg-h" font-size="13.5" text-anchor="middle">+ σ<tspan dy="3" font-size="0.75em">t</tspan><tspan dy="-3"> z</tspan></text>
<text x="104" y="272" class="dg-m" font-size="11.5" text-anchor="middle">z ~ N(0, I)</text>
<path d="M104 288L104 304" class="dg-l" marker-end="url(#fig-step-arr)"/>
<path d="M204 259H214" class="dg-ld"/>
<text x="220" y="256" class="dg-t" font-size="12" text-anchor="start">fresh, scheduled randomness;</text>
<text x="220" y="272" class="dg-m" font-size="12" text-anchor="start">z = 0 at the final step</text>
<rect x="10" y="306" width="188" height="54" rx="8" class="dg-a"/>
<text x="104" y="329" class="dg-h" font-size="13.5" text-anchor="middle">x<tspan dy="3" font-size="0.75em">t−1</tspan></text>
<text x="104" y="346" class="dg-m" font-size="11.5" text-anchor="middle">next, less noisy state</text>
<path d="M204 333H214" class="dg-ld"/>
<text x="220" y="330" class="dg-t" font-size="12" text-anchor="start">fed back in as the input</text>
<text x="220" y="346" class="dg-m" font-size="12" text-anchor="start">for noise level t − 1</text>
</svg>
<figcaption><strong>Figure 3. One reverse step.</strong> Only the second box involves learned parameters. The mean is computed from the prediction with a fixed formula, and the added noise has a fixed, scheduled size. Generation repeats this step 1,000 times in the paper’s setup.</figcaption>
</figure>

Because each reverse step is a probability distribution, not a single point. The mean is the center of the plausible slightly-cleaner states, and $\sigma_t z$ picks one of them. Recall the callout: at high noise, the network's prediction is an average over many possible images, and an average of many images is not itself one of them. Sampling commits to one possibility, and later steps refine it. The chain still gets cleaner overall because the sizes are matched to the schedule: with a perfect noise estimate, each step would land at roughly the noise level of step $t-1$, fresh randomness included. At the last step $z = 0$, so the output gets no extra perturbation.

This randomness, with the random starting point, is why different runs produce different images. It also answers the opening question in its sharpest form. **The starting noise has no image hidden inside it.** Generation doesn't recover an original; it constructs a new image, step by step, guided by what the network learned about which images are plausible at each noise level.

The authors observe that this tends to go from broad to fine: in the intermediate predictions of $x_0$, large-scale features appear first and details last. Fix an intermediate $x_t$ and sample from it several times, and the results share only high-level attributes when $t$ is large, but nearly everything except fine detail when $t$ is small. That's an observed tendency, not a schedule assigning concepts to particular timesteps. And unlike autoregressive image models, which generate pixels in a fixed order, each diffusion step updates the whole image.

<details>
<summary>The score connection, briefly</summary>

The *score* of a distribution is the gradient of its log density, $\nabla_x \log p(x)$: at any point, it points toward where the distribution has more probability. The paper shows that the noise predictor implicitly estimates the score of the noised data distribution at each timestep:

$$
s_\theta(x_t, t) = -\frac{\epsilon_\theta(x_t, t)}{\sqrt{1-\bar\alpha_t}}
$$

The intuition: if $\epsilon_\theta$ estimates the noise in $x_t$, then moving against it moves toward images that are more probable at that noise level. This links DDPM to denoising score matching across multiple noise levels and to Langevin-style sampling (Song and Ermon, 2019), and the sampling loop above resembles annealed Langevin dynamics. The variational argument explains why noise prediction trains a valid probabilistic model; the score view explains why it also gives a direction to move in.

</details>

## Why the simpler loss looked better

$L_\text{simple}$ isn't the objective probability theory hands you. The principled goal is to maximize the likelihood $p_\theta(x_0)$ of real images, but that means summing over every noisy trajectory that could have led to $x_0$, which is intractable. As with variational autoencoders, the paper trains on a variational bound instead, which splits into one term per timestep. With noise prediction, each term is the same squared error times a weight that depends on $t$.

$L_\text{simple}$ drops those weights, which changes the objective rather than rearranging it. Under the paper's schedule, the bound weights the error at $t = 2$ about 25 to 50 times more than at $t = 100$ and beyond. Equal weights shift attention away from nearly clean images, where the remaining work is tiny pixel differences, toward heavily corrupted ones, where the network must reconstruct structure. On unconditional CIFAR-10:

| Training objective | FID (lower is better) | Test NLL bound, bits/dim (lower is better) |
| --- | --- | --- |
| Variational bound, fixed variances | 13.51 | ≤ 3.70 |
| $L_\text{simple}$ | 3.17 | ≤ 3.75 |

**FID** (Fréchet Inception Distance) compares statistics of generated and real images as seen by a pretrained image classifier; lower means the generated set looks more like the real one. **NLL in bits per dimension** is how many bits per pixel channel the model needs to encode real test images exactly; lower means real images get higher probability. It's reported as an upper bound ("≤") because it comes from the variational bound.

The simplified loss produced much better samples (the paper reports 3.17 as a state-of-the-art FID for unconditional CIFAR-10 at the time) with a slightly worse likelihood bound, and the authors note their likelihoods weren't competitive with other likelihood-based models. These are historical results; they say more about the tradeoff than about diffusion models today.

<details>
<summary>The bound term by term</summary>

The bound has three kinds of terms:

$$
L = \mathbb{E}_q\Big[ \underbrace{D_\text{KL}\big(q(x_T \mid x_0)\,\|\,p(x_T)\big)}_{L_T} + \sum_{t>1} \underbrace{D_\text{KL}\big(q(x_{t-1} \mid x_t, x_0)\,\|\,p_\theta(x_{t-1} \mid x_t)\big)}_{L_{t-1}} \underbrace{-\log p_\theta(x_0 \mid x_1)}_{L_0} \Big]
$$

- $L_T$ compares the fully noised image with pure noise. Since the $\beta_t$ are fixed, it has no learnable parameters.
- Each $L_{t-1}$ compares two Gaussians with fixed variances, so it reduces to a weighted squared difference between their means. With the noise parameterization, it becomes $\frac{\beta_t^2}{2\sigma_t^2\alpha_t(1-\bar\alpha_t)}\,\|\epsilon - \epsilon_\theta(x_t, t)\|^2$ plus a constant. These are the weights $L_\text{simple}$ removes.
- $L_0$ handles the final step. Real images have discrete pixel values (256 per channel), but the chain is continuous, so the paper's last step assigns each valid pixel value the probability that the final Gaussian falls in a small interval around it. This makes the model a proper distribution over discrete images, which is what lets its likelihood be read as a codelength.

</details>

## Where the bits go

Likelihood is easier to interpret as compression. A model can encode an image losslessly in roughly $-\log_2 p_\theta(x)$ bits, so more probable images get shorter codes. Lossless means *exact*: every pixel value comes back unchanged, including differences no one could see.

For their best-sample CIFAR-10 model, the authors they report a *rate* of 1.78 bits/dim (the bits sent to describe the image up to small errors) and a *distortion* of 1.97 bits/dim (the remaining cost of pinning down exact pixel values). Together they add up to the 3.75 in the table. That distortion corresponds to a root-mean-squared error of only 0.95 on the 0 to 255 pixel scale: almost two bits per dimension go to fixing errors of about one pixel level. The authors' summary is that more than half of the lossless codelength describes imperceptible distortions.

This helps explain why sample quality and likelihood can tell different stories: a likelihood-focused objective must spend effort on detail that doesn't change how an image looks. The authors read it as an inductive bias toward good *lossy* compression. That's an interpretation of where the bits go, not evidence that the network stores human-recognizable concepts. Likewise, the train and test bounds (3.72 versus 3.75) differ by at most 0.03 bits/dim, which the authors take to mean the model isn't overfitting. A small average gap is reassuring, but it doesn't prove that no individual training image is memorized.

## What I take from this

Partway through the paper's background section, my notes record a decision: there were many more equations to break down, and I chose to go big picture. Having finished, my answer to "how much of the math do you need?" is about three equations: the direct noising formula, which makes training cheap; the mean formula, which turns a noise estimate into a backward step; and the fact that $L_\text{simple}$ is a reweighted likelihood bound. The full derivation explains why the model is a valid probabilistic model, and the score view explains why noise prediction gives a useful direction. Neither is needed to see the mechanism, but the derivation earns its place once you ask what $L_\text{simple}$ gives up.

Put together, the answer to my opening question is a chain:

1. Each reverse step is modeled as a Gaussian.
2. With fixed variances, learning that Gaussian means learning its mean.
3. The mean can be written in terms of the noise in the current state.
4. So predicting noise, which we can supervise for free, is a way of learning the mean.
5. Chaining many sampled reverse steps from fresh noise generates a new image.

The authors kept the probabilistic reverse process but changed how much weight each part of it gets during training. They used the derivation to find a valid learning task, then used experiments to choose the version of it that produced the best images.

The main cost in this paper is generation speed. Training jumps to random noise levels, but sampling walks all 1,000 steps in order, one network evaluation each. That isn't a fixed property of diffusion models: later work such as DDIM (Song, Meng and Ermon, 2021) reports samples 10 to 50 times faster in wall-clock time. Text conditioning, latent diffusion and faster samplers all came after DDPM.

## Where diffusion models show up in biology now

Everything in this section is later work that builds on diffusion ideas, not part of DDPM itself. I'm keeping it here as a map of where the paper's ideas lead, with each example's connection back to the mechanism above.

**Protein design.** RFdiffusion (Watson et al., 2023) fine-tunes the RoseTTAFold structure-prediction network to act as the denoiser, generating new protein backbones for tasks such as binder design, symmetric oligomers and scaffolding a functional motif. A designed binder's cryo-EM structure, solved in complex with influenza haemagglutinin, closely matched the design model. Chroma (Ingraham et al., 2023) samples structures and sequences together, and the authors experimentally characterized 310 of its proteins. EvoDiff (Alamdari et al., 2023, a preprint) diffuses over amino-acid sequences rather than 3D coordinates. *Connection:* these models are **conditional**, generating a protein that satisfies a constraint rather than any plausible protein, an ingredient DDPM's unconditional setup doesn't have.

**Structure prediction.** AlphaFold 3 (Abramson et al., 2024) uses a diffusion-based architecture to predict the joint structure of complexes containing proteins, nucleic acids, small molecules, ions and modified residues. *Connection:* here the network denoises toward one structure given a sequence, so diffusion is used for prediction, not only for open-ended generation.

**Drug discovery.** DiffDock (Corso et al., 2023) treats docking as diffusion over a ligand's position, orientation and torsion angles in a protein pocket. Equivariant diffusion (Hoogeboom et al., 2022) generates 3D molecules, atom positions and types together, and TargetDiff (Guan et al., 2023) generates them for a specific protein target. *Connection:* the fresh randomness in every reverse step means many different candidates per run, which suits screening, though sequential sampling cost adds up quickly.

**Regulatory DNA.** The Dirichlet diffusion score model (Avdeyev et al., 2023) replaces Gaussian noise with a process suited to discrete letters and was applied to designing human promoter sequences. DNA-Diffusion (DaSilva et al., 2026) generates 200-base-pair regulatory elements conditioned on cell type and tested them in a 5,850-element STARR-seq library across three cell lines. *Connection:* DNA letters are discrete, like the pixel values DDPM's final step had to handle, so the noise process or the representation has to be adapted.

**Medical imaging.** Score-based diffusion models can reconstruct MRI and CT images from incomplete measurements (Chung and Ye, 2022; Song et al., 2022): the model supplies what plausible images look like, and the measurements constrain which one is produced. *Connection:* this is the score view from the optional section above, put to work.

**Single-cell data.** scDiffusion (Luo et al., 2024) generates single-cell RNA-seq profiles, including conditional generation. This application is newer than the others.

<div class="callout" role="note">

**Caveats that carry over from the paper.**

- **Plausible is not the same as functional.** DDPM's best-looking samples didn't have the best likelihood, and in biology a convincing structure or sequence still has to work in the lab. The strongest examples above report experimental validation.
- **Models can memorize training data.** Carlini et al. (2023) extracted over a thousand training images from state-of-the-art image diffusion models. That makes the earlier caution about small train-test gaps practical when the training data are patient scans or other sensitive records.
- **Sampling is sequential.** DDPM's 1,000 steps per sample add up when a screen needs thousands of candidates, one reason faster samplers matter in this area.

</div>

## References

- Ho, J., Jain, A., and Abbeel, P. (2020). Denoising Diffusion Probabilistic Models. *NeurIPS*. [arXiv:2006.11239](https://arxiv.org/abs/2006.11239)
- Sohl-Dickstein, J., Weiss, E. A., Maheswaranathan, N., and Ganguli, S. (2015). Deep Unsupervised Learning using Nonequilibrium Thermodynamics. *ICML*. [arXiv:1503.03585](https://arxiv.org/abs/1503.03585)
- Song, Y., and Ermon, S. (2019). Generative Modeling by Estimating Gradients of the Data Distribution. *NeurIPS*. [arXiv:1907.05600](https://arxiv.org/abs/1907.05600)
- Heusel, M., Ramsauer, H., Unterthiner, T., Nessler, B., and Hochreiter, S. (2017). GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium. *NeurIPS*. [arXiv:1706.08500](https://arxiv.org/abs/1706.08500) (introduces FID)
- Song, J., Meng, C., and Ermon, S. (2021). Denoising Diffusion Implicit Models. *ICLR*. [arXiv:2010.02502](https://arxiv.org/abs/2010.02502)
- Watson, J. L., Juergens, D., Bennett, N. R., et al. (2023). De novo design of protein structure and function with RFdiffusion. *Nature*, 620, 1089–1100. [doi:10.1038/s41586-023-06415-8](https://doi.org/10.1038/s41586-023-06415-8)
- Ingraham, J. B., Baranov, M., Costello, Z., et al. (2023). Illuminating protein space with a programmable generative model. *Nature*, 623, 1070–1078. [doi:10.1038/s41586-023-06728-8](https://doi.org/10.1038/s41586-023-06728-8)
- Alamdari, S., Thakkar, N., van den Berg, R., et al. (2023). Protein generation with evolutionary diffusion: sequence is all you need. *bioRxiv* preprint. [doi:10.1101/2023.09.11.556673](https://doi.org/10.1101/2023.09.11.556673)
- Abramson, J., Adler, J., Dunger, J., et al. (2024). Accurate structure prediction of biomolecular interactions with AlphaFold 3. *Nature*, 630, 493–500. [doi:10.1038/s41586-024-07487-w](https://doi.org/10.1038/s41586-024-07487-w)
- Corso, G., Stärk, H., Jing, B., Barzilay, R., and Jaakkola, T. (2023). DiffDock: Diffusion Steps, Twists, and Turns for Molecular Docking. *ICLR*. [arXiv:2210.01776](https://arxiv.org/abs/2210.01776)
- Hoogeboom, E., Satorras, V. G., Vignac, C., and Welling, M. (2022). Equivariant Diffusion for Molecule Generation in 3D. *ICML*. [arXiv:2203.17003](https://arxiv.org/abs/2203.17003)
- Guan, J., Qian, W. W., Peng, X., Su, Y., Peng, J., and Ma, J. (2023). 3D Equivariant Diffusion for Target-Aware Molecule Generation and Affinity Prediction. *ICLR*. [arXiv:2303.03543](https://arxiv.org/abs/2303.03543)
- Avdeyev, P., Shi, C., Tan, Y., Dudnyk, K., and Zhou, J. (2023). Dirichlet Diffusion Score Model for Biological Sequence Generation. *ICML*. [arXiv:2305.10699](https://arxiv.org/abs/2305.10699)
- DaSilva, L. F., Senan, S., Kribelbauer-Swietek, J. F., et al. (2026). Designing synthetic regulatory elements using the generative AI framework DNA-Diffusion. *Nature Genetics*, 58, 180–194. [doi:10.1038/s41588-025-02441-6](https://doi.org/10.1038/s41588-025-02441-6)
- Chung, H., and Ye, J. C. (2022). Score-based diffusion models for accelerated MRI. *Medical Image Analysis*. [doi:10.1016/j.media.2022.102479](https://doi.org/10.1016/j.media.2022.102479)
- Song, Y., Shen, L., Xing, L., and Ermon, S. (2022). Solving Inverse Problems in Medical Imaging with Score-Based Generative Models. *ICLR*. [arXiv:2111.08005](https://arxiv.org/abs/2111.08005)
- Luo, E., Hao, M., Wei, L., et al. (2024). scDiffusion: conditional generation of high-quality single-cell data using diffusion model. *Bioinformatics*. [doi:10.1093/bioinformatics/btae518](https://doi.org/10.1093/bioinformatics/btae518)
- Carlini, N., Hayes, J., Nasr, M., et al. (2023). Extracting Training Data from Diffusion Models. *USENIX Security*. [arXiv:2301.13188](https://arxiv.org/abs/2301.13188)

For a longer derivation-by-derivation treatment, see Lilian Weng's [What are Diffusion Models?](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/).
