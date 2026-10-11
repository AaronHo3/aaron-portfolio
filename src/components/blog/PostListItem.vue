<template>
  <article class="card postItem">
    <div class="postMeta">
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      <span aria-hidden="true">·</span>
      <span>{{ post.readingMinutes }} min read</span>
      <RouterLink v-if="series?.path" class="blogSeriesBadge" :to="series.path">{{ series.label }}</RouterLink>
      <span v-else-if="series" class="blogSeriesBadge">{{ series.label }}</span>
      <span v-if="post.state !== 'published'" class="blogStateBadge">
        {{ post.state === "draft" ? "Draft" : "Scheduled" }}, preview only
      </span>
    </div>

    <component :is="`h${headingLevel}`" class="postTitle">
      <RouterLink :to="postPath(post.slug)">{{ post.title }}</RouterLink>
    </component>
    <p class="postDesc">{{ post.description }}</p>

    <ul v-if="post.tags.length" class="blogTags" aria-label="Topics">
      <li v-for="tag in post.tags" :key="tag">
        <RouterLink class="blogTag" :to="{ path: '/blog', query: { topic: tag } }">{{ topicLabel(tag) }}</RouterLink>
      </li>
    </ul>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { formatDate } from "../../lib/content/dates.js";
import { postPath } from "../../lib/content/urls.js";
import { seriesInfo, topicLabel } from "../../lib/content/labels.js";

const props = defineProps({
  post: { type: Object, required: true },
  headingLevel: { type: Number, default: 2 },
});

const series = computed(() => seriesInfo(props.post.series));
</script>

<style scoped>
.postItem {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.postMeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
}

.postTitle {
  margin: 0;
  font-size: clamp(20px, 2vw, 24px);
  letter-spacing: -0.02em;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.postTitle a {
  text-decoration: none;
  color: var(--text);
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 2px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 220ms ease, color 160ms ease;
}

.postTitle a:hover {
  color: var(--accent);
  background-size: 100% 2px;
}

.postDesc {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
  max-width: 72ch;
}

@media (prefers-reduced-motion: reduce) {
  .postTitle a {
    transition: none;
  }
}
</style>
