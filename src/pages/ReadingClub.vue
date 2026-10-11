<template>
  <div class="container page club">
    <RouterLink class="backLink" to="/blog">← Blogging</RouterLink>
    <header class="clubHead">
      <p class="eyebrow">Series · {{ readingClub.cadence }}</p>
      <h1 class="page-title clubTitle">ML × Bio Reading Club</h1>
      <p class="lead">
        A Sunday evening book club working through foundational machine learning papers and what they mean for
        biology. This page is where I put my thoughts down after each session: the core idea, where it falls short, and
        sometimes a small implementation. It is a learning-in-public project, and newcomers to ML or biology are
        welcome.
      </p>
      <div v-if="clubLinks.length" class="clubLinks">
        <a v-for="link in clubLinks" :key="link.label" class="btn btn-sm" :href="link.href" target="_blank" rel="noopener noreferrer">
          {{ link.label }}<span class="visually-hidden"> (opens in a new tab)</span> ↗
        </a>
      </div>
    </header>

    <div v-if="previewMode && authoringIssues.length" class="notice warnings" role="note">
      <strong>Authoring warnings (local preview only)</strong>
      <ul>
        <li v-for="issue in authoringIssues" :key="issue">{{ issue }}</li>
      </ul>
    </div>

    <section class="section" aria-labelledby="roadmap-title">
      <h2 id="roadmap-title" class="sectionTitle">Reading roadmap</h2>
      <p class="muted sectionIntro">
        In reading order. Exercises are proposed learning applications, not experiments from the original papers.
      </p>
      <ol v-if="roadmap.length" class="roadmap">
        <li v-for="(paper, i) in roadmap" :key="paper.id">
          <PaperCard :paper="paper" :position="i + 1" :time-zone-label="readingClub.timeZoneLabel" />
        </li>
      </ol>
      <p v-else class="emptyNote">No papers on the list right now.</p>
    </section>

    <section class="section" aria-labelledby="archive-title">
      <h2 id="archive-title" class="sectionTitle">Session notes</h2>
      <ol v-if="archive.length" class="archive">
        <li v-for="post in archive" :key="post.slug">
          <PostListItem :post="post" :heading-level="3" />
        </li>
      </ol>
      <p v-else class="emptyNote">
        <strong>No notes published yet.</strong> Write-ups appear here after each session.
      </p>
    </section>
  </div>
</template>

<script setup>
import PaperCard from "../components/blog/PaperCard.vue";
import PostListItem from "../components/blog/PostListItem.vue";
import { isLive, livePosts, posts, previewMode } from "../lib/content/blog.js";
import { buildRoadmap, crossCheckRoadmap, validateRoadmap } from "../lib/content/roadmap.js";
import { absoluteUrl, READING_CLUB_PATH } from "../lib/content/urls.js";
import { papers } from "../content/reading-club/roadmap.js";
import { readingClub } from "../content/reading-club/config.js";
import { READING_CLUB_SERIES, site } from "../content/site.config.js";
import { usePageHead } from "../lib/head.js";
import "../styles/blog.css";

// Article links resolve against published posts only, even in local preview.
const roadmap = buildRoadmap(papers, livePosts);
const archive = posts.filter((p) => p.series === READING_CLUB_SERIES);

const clubLinks = [
  { label: "Join the meeting", href: readingClub.meetingUrl },
  { label: "Discussion", href: readingClub.discussionUrl },
  { label: "Companion code", href: readingClub.codeRepoUrl },
].filter((link) => link.href);

const authoringIssues = previewMode
  ? (() => {
      const { errors, warnings } = validateRoadmap(papers);
      return [...errors, ...warnings, ...(errors.length ? [] : crossCheckRoadmap(papers, posts, isLive))];
    })()
  : [];

usePageHead(() => ({
  title: `ML × Bio Reading Club | ${site.title}`,
  description:
    "Notes from a Sunday evening book club on foundational machine learning papers and what they mean for biology.",
  canonical: absoluteUrl(READING_CLUB_PATH),
}));
</script>

<style scoped>
.clubHead {
  max-width: 820px;
  margin-top: var(--space-3);
}

.clubTitle {
  margin-top: var(--space-2);
}

.clubHead .lead {
  margin-top: var(--space-4);
}

.clubLinks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.warnings {
  margin-top: var(--space-5);
  max-width: var(--w-wide);
}

.section {
  max-width: var(--w-wide);
}

.sectionTitle {
  padding-bottom: var(--space-3);
  border-bottom: var(--border);
}

.sectionIntro {
  margin-top: var(--space-3);
  max-width: var(--w-prose);
  font-size: var(--fs-small);
}

.roadmap,
.archive {
  margin: 0;
  padding: 0;
  list-style: none;
}

.emptyNote {
  margin-top: var(--space-5);
}
</style>
