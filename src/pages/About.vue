<template>
  <div class="container page about">
    <!-- Intro -->
    <section class="intro" aria-labelledby="about-title">
      <div class="introText">
        <p class="eyebrow">About me</p>
        <h1 id="about-title" class="aboutTitle">Aaron Ho</h1>
        <p class="role">Dog Lover · Curious by nature</p>
        <p class="lead">
          I’ve always been drawn to understanding how things work, especially complex systems and challenging
          problems. I enjoy breaking ideas down, learning from different perspectives, and building things that can
          make a real impact.
        </p>
        <p class="introBody">
          Curiosity, thoughtful problem-solving, and continuous growth are values I try to carry with me in everything
          I do.
        </p>
        <p class="availability">
          <span class="dot" aria-hidden="true"></span>
          <span><strong>Currently available.</strong> Open to full-time roles &amp; collaborations.</span>
        </p>
      </div>
      <figure class="photo introPhoto">
        <img :src="osakaCastlePhoto" alt="Aaron smiling on the steps in front of Osaka Castle" width="1024" height="1536" fetchpriority="high" />
        <figcaption>Osaka Castle, December 2025</figcaption>
      </figure>
    </section>

    <!-- Focus and values -->
    <section class="section twoCol" aria-label="Focus and values">
      <div>
        <h2 class="colTitle">Focus areas right now</h2>
        <p class="muted colIntro">What I am currently exploring.</p>
        <ul class="plainList">
          <li>Personalized/Precision Medicine</li>
          <li>Digital Twins</li>
          <li>Disease Diagnosis and Prognostics</li>
          <li>AI-Assisted Robotic Surgery</li>
        </ul>
      </div>
      <div>
        <h2 class="colTitle">What I value</h2>
        <p class="muted colIntro">Principles that guide the work.</p>
        <p class="values">Ownership, clarity, craft, honesty, curiosity, and growth.</p>
        <blockquote class="quote">
          <p>“Motivation forgives mistakes, hesitation charges interest.”</p>
          <footer class="meta">A guiding thought, and a personal favourite</footer>
        </blockquote>
      </div>
    </section>

    <!-- Background -->
    <section class="section" aria-labelledby="background-title">
      <div class="section-head">
        <h2 id="background-title">Background</h2>
        <a class="text-link" :href="resumeHref" target="_blank" rel="noopener">
          Full resume (PDF)<span class="visually-hidden"> opens in a new tab</span> <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <ol class="timeline">
        <li v-for="job in experience" :key="job.org + job.dates">
          <p class="meta">{{ job.dates }}</p>
          <div>
            <h3 class="tlRole">{{ job.role }}</h3>
            <p class="tlOrg">{{ [job.org, job.unit].filter(Boolean).join(" · ") }}</p>
            <p v-if="job.summary" class="tlSummary">{{ job.summary }}</p>
          </div>
        </li>
      </ol>
      <h3 class="eduHeading eyebrow">Education</h3>
      <ul class="eduList">
        <li v-for="ed in education" :key="ed.school">
          <p class="tlRole">{{ ed.degree }}</p>
          <p class="tlOrg">{{ ed.school }}</p>
          <p class="tlSummary">{{ ed.detail }}</p>
        </li>
      </ul>
    </section>

    <!-- Beyond the screen -->
    <section class="section beyond" aria-labelledby="beyond-title">
      <div class="beyondText">
        <p class="eyebrow">My “5-9”</p>
        <h2 id="beyond-title">Beyond the screen</h2>
        <p>
          Away from the computer, I recharge through volleyball, time outdoors, and training in the gym. I’m always on
          the lookout for new music and new experiences, and I value spending time with people who challenge me to grow
          and broaden my perspective.
        </p>
      </div>
      <figure class="photo momo">
        <img :src="momoPhoto" alt="Momo, a curly brown dog in an orange harness, sitting and smiling" width="1024" height="1536" loading="lazy" />
        <figcaption>Momo, what I love</figcaption>
      </figure>
      <figure class="photo sequoia">
        <img :src="sequoiaPhoto" alt="A group of people sitting inside a huge fallen sequoia trunk in a green forest" width="1200" height="900" loading="lazy" />
        <figcaption>Sequoia National Park, June 2025</figcaption>
      </figure>
    </section>

    <!-- Travel photos -->
    <section class="travel" aria-label="Travel photos">
      <figure class="photo">
        <img :src="arashiyamaPhoto" alt="Aaron standing in the Arashiyama bamboo forest, looking up" width="1024" height="1365" loading="lazy" />
        <figcaption>Arashiyama Bamboo Forest, July 2026</figcaption>
      </figure>
      <figure class="photo">
        <img :src="fushimiInariPhoto" alt="Aaron leaning on a bright orange railing beneath green maple trees at Fushimi Inari" width="1024" height="1365" loading="lazy" />
        <figcaption>Fushimi Inari, July 2026</figcaption>
      </figure>
    </section>
  </div>
</template>

<script setup>
import momoPhoto from "../assets/momo.webp";
import osakaCastlePhoto from "../assets/osaka-castle-steps.webp";
import sequoiaPhoto from "../assets/sequoia-national-park.webp";
import arashiyamaPhoto from "../assets/arashiyama-forest.webp";
import fushimiInariPhoto from "../assets/fushimi-inari.webp";
import { education, experience, profile } from "../data/profile.js";

const resumeHref = `${import.meta.env.BASE_URL}${profile.resumePath}`;
</script>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: var(--space-8);
  align-items: center;
}

.aboutTitle {
  margin-top: var(--space-2);
  font-size: var(--fs-hero);
  line-height: 1.02;
}

.role {
  margin: var(--space-3) 0 var(--space-5);
  color: var(--color-text-muted);
  font-weight: 600;
}

.introBody {
  margin-top: var(--space-4);
  max-width: 60ch;
}

.availability {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: var(--border);
}

.dot {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  transform: translateY(-1px);
}

/* Photos share one treatment: rounded, captioned, fixed aspect ratios */
.photo {
  margin: 0;
}

.photo img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.photo figcaption {
  margin-top: var(--space-2);
  font-size: var(--fs-meta);
  color: var(--color-text-muted);
}

.introPhoto img {
  aspect-ratio: 4 / 5;
  object-position: center 30%;
}

/* Focus and values */
.twoCol {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-8);
  padding-top: var(--space-6);
  border-top: var(--border);
}

.colTitle {
  font-size: var(--fs-h3);
}

.colIntro {
  margin: var(--space-2) 0 var(--space-4);
}

.plainList {
  margin: 0;
  padding: 0;
  list-style: none;
}

.plainList li {
  padding: var(--space-3) 0;
  border-bottom: var(--border);
  font-weight: 600;
}

.values {
  font-family: var(--font-serif);
  font-size: var(--fs-lead);
  line-height: 1.45;
}

.quote {
  margin: var(--space-6) 0 0;
  padding-left: var(--space-5);
  border-left: 3px solid var(--color-accent);
}

.quote p {
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
  font-style: italic;
  line-height: 1.35;
}

.quote footer {
  margin-top: var(--space-2);
}

/* Background */
.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: var(--border);
}

.timeline li {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: var(--space-5);
  padding: var(--space-5) 0;
  border-bottom: var(--border);
}

.timeline .meta {
  padding-top: 3px;
}

.tlRole {
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  font-weight: 700;
}

.tlOrg {
  color: var(--color-text-muted);
  font-size: var(--fs-small);
}

.tlSummary {
  margin-top: var(--space-2);
  max-width: var(--w-prose);
}

.eduHeading {
  margin: var(--space-7) 0 var(--space-4);
  font-size: var(--fs-meta);
}

.eduList {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Beyond the screen: text, then two photos at their natural shapes */
.beyond {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.7fr) minmax(0, 1.2fr);
  gap: var(--space-6);
  align-items: start;
  padding-top: var(--space-6);
  border-top: var(--border);
}

.beyondText {
  align-self: start;
}

.beyondText h2 {
  margin: var(--space-2) 0 var(--space-4);
}

.momo img {
  aspect-ratio: 3 / 4;
}

.sequoia img {
  aspect-ratio: 4 / 3;
}

/* Travel: two portrait photos side by side, sized like the Momo photo */
.travel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 340px));
  justify-content: end; /* continues the photo column above on wide screens */
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.travel img {
  aspect-ratio: 3 / 4;
}

@media (max-width: 960px) {
  .travel {
    justify-content: start;
    gap: var(--space-4);
  }
  .beyond {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .beyondText {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .intro,
  .twoCol,
  .eduList {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .introPhoto {
    max-width: 360px;
  }
  .timeline li {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }
}

@media (max-width: 520px) {
  .beyond {
    grid-template-columns: 1fr;
  }
}
</style>
