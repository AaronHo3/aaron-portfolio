<template>
  <section class="section blogScope">
    <header class="clubHead">
      <RouterLink class="blogBackLink" to="/blog">← Writing</RouterLink>
      <p class="blogEyebrow">Series · {{ readingClub.cadence }}</p>
      <h1 class="blogPageTitle">ML × Bio Reading Club</h1>
      <p class="blogLede">
        A Sunday evening reading group working through foundational machine learning papers. For each one we discuss
        the central idea and its limits, ask what it means for biology and biotech, and try it in a small
        implementation. It is a learning-in-public project, and newcomers to ML or biology are welcome: every paper
        lists what helps to know first.
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

    <div class="topGrid">
      <section class="card nextCard" aria-labelledby="nextHeading">
        <h2 id="nextHeading" class="blogEyebrow">Next session</h2>
        <template v-if="nextSession">
          <p class="nextDate">
            <time :datetime="nextSession.sessionDate">
              {{ weekdayOf(nextSession.sessionDate) }}, {{ formatDate(nextSession.sessionDate) }}
            </time>
            <span v-if="nextSession.sessionTime">
              · {{ formatTime(nextSession.sessionTime) }}<span v-if="readingClub.timeZoneLabel"> {{ readingClub.timeZoneLabel }}</span>
            </span>
          </p>
          <p class="nextTitle">
            <a :href="nextSession.url" target="_blank" rel="noopener noreferrer">
              {{ nextSession.title }}<span class="srOnly"> (original paper, opens in a new tab)</span><span aria-hidden="true"> ↗</span>
            </a>
          </p>
          <p v-if="nextSession.question" class="nextQuestion">{{ nextSession.question }}</p>
          <div v-if="nextLinks.length" class="nextLinks">
            <a v-for="link in nextLinks" :key="link.label" class="btn" :href="link.href" target="_blank" rel="noopener noreferrer">
              {{ link.label }}<span class="srOnly"> (opens in a new tab)</span> ↗
            </a>
          </div>
        </template>
        <div v-else class="nextEmpty">
          <p class="nextEmptyTitle">No session is scheduled yet.</p>
          <p>
            The club meets {{ readingClub.cadence }}. Once a date is set it will appear here. Until
            then, the roadmap below is a working list of candidates, not a schedule.
          </p>
        </div>
      </section>

      <section class="card formatCard" aria-labelledby="formatHeading">
        <h2 id="formatHeading" class="blogEyebrow">Format · {{ totalMinutes }} minutes</h2>
        <ol class="formatList">
          <li v-for="step in readingClub.format" :key="step.title">
            <span class="formatMin">{{ step.minutes }} min</span>
            <span>
              <strong>{{ step.title }}.</strong>
              {{ step.detail }}
            </span>
          </li>
        </ol>
        <p class="formatNote">Afterward, a write-up goes on the blog, with a small implementation when it helps.</p>
      </section>
    </div>

    <section class="section" aria-labelledby="roadmapHeading">
      <h2 id="roadmapHeading" class="sectionTitle">Reading roadmap</h2>
      <p class="sectionLede">
        Suggested papers in a rough reading order. The list changes as the club goes: papers get added, dropped, and
        reshuffled. Exercises are proposed learning applications, not experiments from the original papers.
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
import { computed } from "vue";
import PaperCard from "../components/blog/PaperCard.vue";
import PostListItem from "../components/blog/PostListItem.vue";
import { isLive, livePosts, posts, previewMode } from "../lib/content/blog.js";
import { formatDate, formatTime, todayIn, weekdayOf } from "../lib/content/dates.js";
import { buildRoadmap, crossCheckRoadmap, findNextSession, validateRoadmap } from "../lib/content/roadmap.js";
import { topicLabel } from "../lib/content/labels.js";
import { absoluteUrl, READING_CLUB_PATH } from "../lib/content/urls.js";
import { papers } from "../content/reading-club/roadmap.js";
import { readingClub } from "../content/reading-club/config.js";
import { READING_CLUB_SERIES, site } from "../content/site.config.js";
import { usePageHead } from "../lib/head.js";
import "../styles/blog.css";

const today = todayIn(site.timeZone);

// Article links resolve against published posts only, even in local preview.
const roadmap = buildRoadmap(papers, livePosts);
const nextSession = findNextSession(papers, today);
const archive = posts.filter((p) => p.series === READING_CLUB_SERIES);

const topics = [...new Set(papers.flatMap((p) => p.topics ?? []))];
const totalMinutes = readingClub.format.reduce((sum, step) => sum + step.minutes, 0);

const clubLinks = [
  { label: "Join the meeting", href: readingClub.meetingUrl },
  { label: "Discussion", href: readingClub.discussionUrl },
  { label: "Companion code", href: readingClub.codeRepoUrl },
].filter((link) => link.href);

const nextLinks = computed(() =>
  [
    { label: "Join the meeting", href: readingClub.meetingUrl },
    { label: "Session discussion", href: nextSession?.discussionUrl },
    { label: "Session code", href: nextSession?.codeUrl },
  ].filter((link) => link.href),
);

const authoringIssues = previewMode
  ? (() => {
      const { errors, warnings } = validateRoadmap(papers);
      return [...errors, ...warnings, ...(errors.length ? [] : crossCheckRoadmap(papers, posts, isLive))];
    })()
  : [];

usePageHead(() => ({
  title: `ML × Bio Reading Club | ${site.title}`,
  description:
    "A Sunday evening reading group on foundational machine learning papers, their biological applications, and small implementations.",
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

.topGrid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 16px;
  margin-top: var(--space-5);
  align-items: start;
}

.nextCard,
.formatCard {
  padding: var(--space-4);
}

.nextCard {
  position: relative;
  overflow: hidden;
}
.nextCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.nextDate {
  margin: 0;
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.nextTitle {
  margin: 10px 0 0;
  font-weight: 850;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.nextTitle a {
  color: var(--text);
  text-decoration: none;
}
.nextTitle a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.nextQuestion {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.6;
}
.nextLinks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.nextEmpty p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}
.nextEmpty .nextEmptyTitle {
  margin-bottom: 6px;
  color: var(--text);
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(19px, 1.8vw, 23px);
  font-weight: 800;
}

.formatList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.formatList li {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  line-height: 1.55;
}
.formatMin {
  font-family: "Fraunces", Georgia, serif;
  font-weight: 800;
  color: var(--accent);
  white-space: nowrap;
}
.formatNote {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.55;
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

@media (max-width: 860px) {
  .topGrid {
    grid-template-columns: 1fr;
  }
}
</style>
