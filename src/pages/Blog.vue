<template>
  <section class="section blogScope">
    <header class="blogHead">
      <h1 class="blogPageTitle">Blogging</h1>
      <p class="blogLede">
        Notes on machine learning and computational biology: technical explanations, project write-ups, paper
        discussions, short implementations, and the occasional reflection. I write to learn, and I hope some of it
        helps others getting started in ML and biology.
      </p>
      <p class="feedLine"><a href="/rss.xml">RSS feed</a></p>
    </header>

    <p v-if="previewMode" class="blogNotice" role="note">
      <strong>Local preview.</strong> Drafts and future-dated posts are listed here with a label. Production builds
      leave them out entirely.
    </p>

    <RouterLink to="/reading-club" class="card clubCallout">
      <span class="blogEyebrow">Series</span>
      <span class="clubTitle">ML × Bio Reading Club</span>
      <span class="clubText">
        A Sunday evening reading group on foundational ML papers, their uses in biology, and small implementations.
      </span>
      <span class="clubCta">See the reading roadmap →</span>
    </RouterLink>

    <div v-if="posts.length" class="filters">
      <p id="topicFilterLabel" class="filterLabel">Filter by topic</p>
      <div class="blogChips" role="group" aria-labelledby="topicFilterLabel">
        <button type="button" class="blogChip" :aria-pressed="!activeTopic && !activeSeries" @click="setFilter({})">
          All
        </button>
        <button
          v-if="hasClubPosts"
          type="button"
          class="blogChip"
          :aria-pressed="activeSeries === READING_CLUB_SERIES"
          @click="setFilter({ series: READING_CLUB_SERIES })"
        >
          Reading club
        </button>
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="blogChip"
          :aria-pressed="activeTopic === tag"
          @click="setFilter({ topic: tag })"
        >
          {{ topicLabel(tag) }}
        </button>
      </div>
    </div>

    <p class="srOnly" aria-live="polite">{{ filtered.length }} {{ filtered.length === 1 ? "post" : "posts" }} shown</p>

    <ol v-if="filtered.length" class="postList">
      <li v-for="post in filtered" :key="post.slug">
        <PostListItem :post="post" />
      </li>
    </ol>

    <div v-else-if="posts.length" class="card blogEmpty">
      <strong>No posts match this filter.</strong>
      <p><button type="button" class="linkButton" @click="setFilter({})">Show all posts</button></p>
    </div>

    <div v-else class="card blogEmpty">
      <strong>No posts published yet.</strong>
      <p>
        In the meantime, the <RouterLink to="/reading-club">reading club roadmap</RouterLink> lists the papers on the
        reading list.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostListItem from "../components/blog/PostListItem.vue";
import { posts, previewMode } from "../lib/content/blog.js";
import { collectTags } from "../lib/content/posts.js";
import { topicLabel } from "../lib/content/labels.js";
import { absoluteUrl, BLOG_PATH } from "../lib/content/urls.js";
import { READING_CLUB_SERIES, site } from "../content/site.config.js";
import { usePageHead } from "../lib/head.js";
import "../styles/blog.css";

const route = useRoute();
const router = useRouter();

const tags = collectTags(posts);
const hasClubPosts = posts.some((p) => p.series === READING_CLUB_SERIES);

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
.blogHead {
  max-width: 820px;
}

.feedLine {
  margin: 10px 0 0;
  font-size: 13px;
  font-weight: 800;
}
.feedLine a {
  color: var(--muted);
}
.feedLine a:hover {
  color: var(--accent);
}

.blogNotice,
.clubCallout {
  max-width: 920px;
}

.clubCallout {
  display: grid;
  gap: 6px;
  margin-top: var(--space-5);
  padding: var(--space-4);
  text-decoration: none;
  color: var(--text);
  position: relative;
  overflow: hidden;
  border-color: color-mix(in srgb, var(--accent-2) 40%, var(--border));
}
.clubCallout::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}
.clubCallout .blogEyebrow {
  margin: 0;
}
.clubTitle {
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.clubText {
  color: var(--muted);
  line-height: 1.55;
  max-width: 70ch;
}
.clubCta {
  margin-top: 4px;
  font-weight: 850;
  color: var(--accent);
}
.clubCallout:hover .clubCta {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.filters {
  margin-top: var(--space-5);
}
.filterLabel {
  margin: 0 0 8px;
  color: var(--muted);
  font-weight: 800;
  font-size: 13px;
}

.postList {
  list-style: none;
  margin: var(--space-4) 0 0;
  padding: 0;
  display: grid;
  gap: 14px;
  max-width: 920px;
}

.blogEmpty {
  margin-top: var(--space-4);
  max-width: 920px;
}
.blogEmpty a {
  color: var(--accent);
}

.linkButton {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: 800;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
</style>
