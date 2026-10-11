<template>
  <div class="container page blogIndex">
    <header class="blogHead">
      <h1 class="page-title">Blogging</h1>
      <p class="lead">
        Notes on machine learning and computational biology: technical explanations, project write-ups, paper
        discussions, short implementations, and the occasional reflection. I write to learn, and I hope some of it
        helps others getting started in ML and biology.
      </p>
      <p class="meta feedLine">
        Follow along with the <a href="/rss.xml">RSS feed</a>.
      </p>
    </header>

    <p v-if="previewMode" class="notice previewNote" role="note">
      <strong>Local preview.</strong> Drafts and future-dated posts are listed with a label. Production builds leave
      them out entirely.
    </p>

    <!-- Reading club feature -->
    <section class="clubFeature" aria-labelledby="club-title">
      <div class="clubText">
        <p class="eyebrow">Series · Sunday evenings</p>
        <h2 id="club-title" class="clubTitle">ML × Bio Reading Club</h2>
        <p class="muted">
          A book club working through foundational ML papers and what they mean for biology. My notes from each
          session are posted here.
        </p>
        <RouterLink class="text-link" to="/reading-club">
          See the reading list <span class="arrow" aria-hidden="true">→</span>
        </RouterLink>
      </div>
      <div v-if="firstPaper" class="clubNext">
        <p class="meta">{{ firstPaper.sessionDate ? `Session, ${formatDate(firstPaper.sessionDate)}` : "Up first" }}</p>
        <p class="clubPaper">{{ firstPaper.title }}</p>
        <p class="meta">{{ shortAuthors(firstPaper.authors) }} · {{ firstPaper.year }}</p>
      </div>
    </section>

    <!-- Posts -->
    <section class="postsSection" aria-labelledby="posts-title">
      <h2 id="posts-title" class="postsTitle">Posts</h2>

      <template v-if="posts.length">
        <div v-if="tags.length > 1" class="filters">
          <p id="topic-filter-label" class="meta filterLabel">Filter by topic</p>
          <div class="chipGroup" role="group" aria-labelledby="topic-filter-label">
            <button type="button" class="chip" :aria-pressed="!activeTopic && !activeSeries" @click="setFilter({})">All</button>
            <button
              v-if="hasClubPosts"
              type="button"
              class="chip"
              :aria-pressed="activeSeries === READING_CLUB_SERIES"
              @click="setFilter({ series: READING_CLUB_SERIES })"
            >
              Reading club
            </button>
            <button
              v-for="tag in tags"
              :key="tag"
              type="button"
              class="chip"
              :aria-pressed="activeTopic === tag"
              @click="setFilter({ topic: tag })"
            >
              {{ topicLabel(tag) }}
            </button>
          </div>
        </div>
        <p class="visually-hidden" aria-live="polite">{{ filtered.length }} {{ filtered.length === 1 ? "post" : "posts" }} shown</p>

        <ol v-if="filtered.length" class="postList">
          <li v-for="post in filtered" :key="post.slug">
            <PostListItem :post="post" :heading-level="3" />
          </li>
        </ol>
        <p v-else class="emptyNote">
          <strong>No posts match this filter.</strong>
          <button type="button" class="linkButton" @click="setFilter({})">Show all posts</button>
        </p>
      </template>

      <p v-else class="emptyNote">
        <strong>Nothing published yet.</strong> The first posts will be notes from the reading club.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostListItem from "../components/blog/PostListItem.vue";
import { posts, previewMode } from "../lib/content/blog.js";
import { collectTags } from "../lib/content/posts.js";
import { formatDate } from "../lib/content/dates.js";
import { shortAuthors, topicLabel } from "../lib/content/labels.js";
import { absoluteUrl, BLOG_PATH } from "../lib/content/urls.js";
import { READING_CLUB_SERIES, site } from "../content/site.config.js";
import { papers } from "../content/reading-club/roadmap.js";
import { usePageHead } from "../lib/head.js";
import "../styles/blog.css";

const route = useRoute();
const router = useRouter();

const tags = collectTags(posts);
const hasClubPosts = posts.some((p) => p.series === READING_CLUB_SERIES);
const firstPaper = papers[0] ?? null;

const activeTopic = computed(() => (typeof route.query.topic === "string" ? route.query.topic : null));
const activeSeries = computed(() => (typeof route.query.series === "string" ? route.query.series : null));

const filtered = computed(() =>
  posts.filter(
    (p) =>
      (!activeTopic.value || p.tags.includes(activeTopic.value)) &&
      (!activeSeries.value || p.series === activeSeries.value),
  ),
);

/** Filters live in the query string so filtered views can be linked. */
function setFilter(query) {
  router.replace({ path: BLOG_PATH, query });
}

usePageHead(() => ({
  title: `${site.blogTitle} | ${site.title}`,
  description: site.blogDescription,
  canonical: absoluteUrl(BLOG_PATH),
}));
</script>

<style scoped>
.blogHead .lead {
  margin-top: var(--space-4);
}

.feedLine {
  margin-top: var(--space-4);
}

.previewNote {
  margin-top: var(--space-5);
  max-width: var(--w-wide);
}

.clubFeature {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: var(--space-6);
  align-items: center;
  max-width: var(--w-wide);
  margin-top: var(--space-7);
  padding: var(--space-6);
  background: var(--color-surface);
  border: var(--border);
  border-radius: var(--radius-lg);
}

.clubText {
  display: grid;
  gap: var(--space-3);
  justify-items: start;
}

.clubTitle {
  font-size: var(--fs-h2);
}

.clubNext {
  display: grid;
  gap: var(--space-1);
  padding-left: var(--space-5);
  border-left: 3px solid var(--color-accent);
}

.clubPaper {
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.postsSection {
  max-width: var(--w-wide);
  margin-top: var(--space-8);
}

.postsTitle {
  padding-bottom: var(--space-3);
  border-bottom: var(--border);
}

.filters {
  margin-top: var(--space-5);
}

.filterLabel {
  margin-bottom: var(--space-2);
}

.postList {
  margin: 0;
  padding: 0;
  list-style: none;
}

.emptyNote {
  margin-top: var(--space-5);
}

.linkButton {
  margin-left: var(--space-2);
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-accent);
  font: inherit;
  font-weight: 650;
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 760px) {
  .clubFeature {
    grid-template-columns: 1fr;
    padding: var(--space-5);
  }
}
</style>
