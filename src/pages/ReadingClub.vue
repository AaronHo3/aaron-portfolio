<template>
  <section class="section blogScope">
    <header class="clubHead">
      <RouterLink class="blogBackLink" to="/blog">← Blogging</RouterLink>
      <p class="blogEyebrow">Series · {{ readingClub.cadence }}</p>
      <h1 class="blogPageTitle">ML × Bio Reading Club</h1>
      <p class="blogLede">
        A Sunday evening book club working through foundational machine learning papers and what they mean for
        biology. This page is where I put my thoughts down after each session: the core idea, where it falls short,
        and sometimes a small implementation. It is a learning-in-public project, and newcomers to ML or biology are
        welcome.
      </p>
      <div v-if="clubLinks.length" class="clubLinks">
        <a v-for="link in clubLinks" :key="link.label" class="btn" :href="link.href" target="_blank" rel="noopener noreferrer">
          {{ link.label }}<span class="srOnly"> (opens in a new tab)</span> ↗
        </a>
      </div>
    </header>

    <div v-if="previewMode && authoringIssues.length" class="blogNotice" role="note">
      <strong>Authoring warnings (local preview only)</strong>
      <ul>
        <li v-for="issue in authoringIssues" :key="issue">{{ issue }}</li>
      </ul>
    </div>

    <section class="section" aria-labelledby="roadmapHeading">
      <h2 id="roadmapHeading" class="sectionTitle">Reading roadmap</h2>
      <p class="sectionLede">
        What we are reading. Exercises are proposed learning applications, not experiments from the original
        papers.
      </p>
      <ul v-if="topics.length" class="blogTags topicSummary" aria-label="Topics on the roadmap">
        <li v-for="t in topics" :key="t"><span class="blogTag">{{ topicLabel(t) }}</span></li>
      </ul>

      <ol v-if="roadmap.length" class="roadmapList">
        <li v-for="(paper, i) in roadmap" :key="`${paper.id}-${i}`">
          <PaperCard :paper="paper" :position="i + 1" :time-zone-label="readingClub.timeZoneLabel" />
        </li>
      </ol>
      <div v-else class="card blogEmpty">
        <strong>The roadmap is empty.</strong>
        <p>New papers will be listed here.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="archiveHeading">
      <h2 id="archiveHeading" class="sectionTitle">Write-ups</h2>
      <ol v-if="archive.length" class="archiveList">
        <li v-for="post in archive" :key="post.slug">
          <PostListItem :post="post" :heading-level="3" />
        </li>
      </ol>
      <div v-else class="card blogEmpty">
        <strong>No write-ups published yet.</strong>
        <p>Articles from this series will be collected here once they are published.</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import PaperCard from "../components/blog/PaperCard.vue";
import PostListItem from "../components/blog/PostListItem.vue";
import { isLive, livePosts, posts, previewMode } from "../lib/content/blog.js";
import { buildRoadmap, crossCheckRoadmap, validateRoadmap } from "../lib/content/roadmap.js";
import { topicLabel } from "../lib/content/labels.js";
import { absoluteUrl, READING_CLUB_PATH } from "../lib/content/urls.js";
import { papers } from "../content/reading-club/roadmap.js";
import { readingClub } from "../content/reading-club/config.js";
import { READING_CLUB_SERIES, site } from "../content/site.config.js";
import { usePageHead } from "../lib/head.js";
import "../styles/blog.css";

// Article links resolve against published posts only, even in local preview.
const roadmap = buildRoadmap(papers, livePosts);
const archive = posts.filter((p) => p.series === READING_CLUB_SERIES);

const topics = [...new Set(papers.flatMap((p) => p.topics ?? []))];

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
  max-width: 860px;
}

.clubLinks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.sectionLede {
  margin: 0;
  max-width: 76ch;
  color: var(--muted);
  line-height: 1.6;
}

.topicSummary {
  margin-top: 14px;
}

.roadmapList,
.archiveList {
  list-style: none;
  margin: var(--space-4) 0 0;
  padding: 0;
  display: grid;
  gap: 14px;
  max-width: 980px;
}

.blogEmpty {
  margin-top: var(--space-4);
  max-width: 980px;
}

</style>
