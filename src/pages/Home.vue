<template>
  <div class="container page home">
    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="heroText">
        <h1 id="hero-title" class="heroTitle">I'm Aaron, building AI for biotech &amp; healthcare.</h1>
        <p class="lead heroLead">
          Previously at Sanofi working on bioreactor digital twins. Now seeking full-time roles while building projects
          using biomedical data.
        </p>
        <div class="heroActions">
          <RouterLink class="btn btn-primary" :to="{ hash: '#selected-work' }">View selected work</RouterLink>
          <a class="btn" :href="resumeHref" target="_blank" rel="noopener">
            Resume<span class="visually-hidden"> (PDF, opens in a new tab)</span>
          </a>
        </div>
      </div>
      <figure class="portrait">
        <img :src="profileSrc" alt="Portrait of Aaron Ho" width="600" height="732" fetchpriority="high" />
      </figure>
    </section>

    <!-- Compact experience line -->
    <section class="expLine" aria-label="Experience">
      <p>
        <span class="eyebrow expLabel">Experience</span>
        <template v-for="(item, i) in experienceLine" :key="item">
          <span v-if="i" class="expSep" aria-hidden="true">·</span>
          <span class="expItem">{{ item }}</span>
        </template>
      </p>
    </section>

    <!-- Selected work -->
    <section id="selected-work" class="section" aria-labelledby="work-title">
      <div class="section-head">
        <h2 id="work-title">Selected work</h2>
        <RouterLink class="text-link" to="/projects">All projects <span class="arrow" aria-hidden="true">→</span></RouterLink>
      </div>
      <ul class="workGrid">
        <li v-for="p in featured" :key="p.slug">
          <ProjectCard :project="p" />
        </li>
      </ul>
    </section>

    <!-- Background -->
    <section class="section background" aria-labelledby="background-title">
      <div class="section-head">
        <h2 id="background-title">Background</h2>
        <RouterLink class="text-link" to="/about">More about me <span class="arrow" aria-hidden="true">→</span></RouterLink>
      </div>
      <div class="bgGrid">
        <div>
          <h3 class="bgHeading eyebrow">Experience</h3>
          <ul class="bgList">
            <li v-for="job in experience" :key="job.org + job.dates">
              <span class="bgPrimary">{{ job.role }}</span>
              <span class="bgSecondary">{{ [job.org, job.unit].filter(Boolean).join(" · ") }}</span>
              <span class="meta">{{ job.dates }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="bgHeading eyebrow">Education</h3>
          <ul class="bgList">
            <li v-for="ed in education" :key="ed.school">
              <span class="bgPrimary">{{ ed.degree }}</span>
              <span class="bgSecondary">{{ ed.school }}</span>
              <span class="meta">{{ ed.detail }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Writing and reading club -->
    <section class="section" aria-labelledby="writing-title">
      <div class="section-head">
        <h2 id="writing-title">Writing &amp; reading club</h2>
        <RouterLink class="text-link" to="/blog">All writing <span class="arrow" aria-hidden="true">→</span></RouterLink>
      </div>
      <div class="writingGrid">
        <div class="writingCol">
          <p class="eyebrow">Latest writing</p>
          <template v-if="latestPost">
            <h3 class="writingTitle">
              <RouterLink :to="postPath(latestPost.slug)">{{ latestPost.title }}</RouterLink>
            </h3>
            <p class="meta">{{ formatDate(latestPost.date) }}</p>
            <p class="muted">{{ latestPost.description }}</p>
          </template>
          <p v-else class="muted">
            Notes on machine learning, computational biology, and the papers I am reading. The first posts will come
            out of the reading club below.
          </p>
        </div>
        <div class="writingCol clubCol">
          <p class="eyebrow">ML × Bio Reading Club</p>
          <h3 class="writingTitle">
            <RouterLink to="/reading-club">Sunday evening papers, read with biology in mind</RouterLink>
          </h3>
          <p v-if="firstPaper" class="muted">
            Up first: <a :href="firstPaper.url" target="_blank" rel="noopener">{{ firstPaper.title }}</a>
            ({{ firstPaper.year }})<span v-if="firstPaper.sessionDate">, {{ formatDate(firstPaper.sessionDate) }}</span>.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="section contactBand" aria-labelledby="contact-title">
      <h2 id="contact-title">Open to full-time roles and research collaborations</h2>
      <p class="muted">Email is the fastest way to reach me.</p>
      <div class="heroActions">
        <a class="btn btn-primary" :href="`mailto:${profile.email}`">Email {{ profile.email }}</a>
        <RouterLink class="btn" to="/contact">Other ways to connect</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import profileSrc from "../assets/profile.webp";
import ProjectCard from "../components/ProjectCard.vue";
import { projects } from "../data/projects";
import { education, experience, profile } from "../data/profile.js";
import { livePosts } from "../lib/content/blog.js";
import { formatDate } from "../lib/content/dates.js";
import { postPath } from "../lib/content/urls.js";
import { papers } from "../content/reading-club/roadmap.js";

/** Featured projects, in display order. Edit this list to change the Home selection. */
const FEATURED_SLUGS = ["gutsense-crc-screening", "imagined-handwriting-decoding", "uci-heart-disease-ml"];

const featured = FEATURED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
const experienceLine = experience.map((job) => job.homeLine).filter(Boolean);
const latestPost = livePosts[0] ?? null;
const firstPaper = papers[0] ?? null;
const resumeHref = `${import.meta.env.BASE_URL}${profile.resumePath}`;
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: var(--space-7);
  align-items: center;
  padding-top: var(--space-5);
}

.heroTitle {
  font-size: var(--fs-hero);
  line-height: 1.05;
  max-width: 14ch;
}

.heroLead {
  margin-top: var(--space-5);
}

.heroActions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.portrait {
  margin: 0;
  justify-self: end;
  width: 100%;
  max-width: 380px;
}

.portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 20%;
  border-radius: var(--radius-lg);
}

/* Compact experience line */
.expLine {
  margin-top: var(--space-7);
  padding: var(--space-4) 0;
  border-top: var(--border);
  border-bottom: var(--border);
}

.expLine p {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-3);
  font-size: var(--fs-small);
  font-weight: 600;
}

.expLabel {
  margin-right: var(--space-2);
  font-size: var(--fs-meta);
}

.expSep {
  color: var(--color-text-muted);
}

/* Background */
.bgGrid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: var(--space-7);
  padding-top: var(--space-5);
  border-top: var(--border);
}

.bgHeading {
  margin-bottom: var(--space-4);
  font-size: var(--fs-meta);
}

.bgList {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.bgList li {
  display: grid;
  gap: 2px;
}

.bgPrimary {
  font-weight: 700;
  line-height: 1.35;
}

.bgSecondary {
  color: var(--color-text-muted);
  font-size: var(--fs-small);
  line-height: 1.45;
}

/* Selected work */
.workGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Writing */
.writingGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-7);
  padding-top: var(--space-5);
  border-top: var(--border);
}

.writingCol {
  display: grid;
  gap: var(--space-3);
  align-content: start;
}

.writingTitle {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: var(--fs-h3);
}

.writingTitle a {
  color: var(--color-text);
  text-decoration: none;
}

.writingTitle a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

/* Contact */
.contactBand {
  padding: var(--space-7) var(--space-6);
  background: var(--color-surface);
  border: var(--border);
  border-radius: var(--radius-lg);
}

.contactBand h2 {
  max-width: 24ch;
}

.contactBand .muted {
  margin-top: var(--space-3);
}

@media (max-width: 1000px) {
  .workGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .hero {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .portrait {
    order: -1;
    justify-self: start;
    max-width: 200px;
  }
  .bgGrid,
  .writingGrid,
  .workGrid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  .contactBand {
    padding: var(--space-6) var(--space-5);
  }
}
</style>
