<template>
  <article class="postItem">
    <p class="postMeta meta">
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      <span aria-hidden="true"> · </span>
      <span>{{ post.readingMinutes }} min read</span>
      <template v-if="series">
        <span aria-hidden="true"> · </span>
        <RouterLink v-if="series.path" class="seriesLabel" :to="series.path">{{ series.label }}</RouterLink>
        <span v-else class="seriesLabel">{{ series.label }}</span>
      </template>
      <span v-if="post.state !== 'published'" class="stateLabel">
        {{ post.state === "draft" ? "Draft" : "Scheduled" }}, preview only
      </span>
    </p>
    <component :is="`h${headingLevel}`" class="postTitle">
      <RouterLink :to="postPath(post.slug)">{{ post.title }}</RouterLink>
    </component>
    <p class="postDesc">{{ post.description }}</p>
    <ul v-if="post.tags.length" class="tag-list" aria-label="Topics">
      <li v-for="tag in post.tags" :key="tag">
        <RouterLink class="tag" :to="{ path: '/blog', query: { topic: tag } }">{{ topicLabel(tag) }}</RouterLink>
      </li>
    </ul>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { formatDate } from "../../lib/content/dates.js";
import { postPath } from "../../lib/content/urls.js";
import { seriesInfo, topicLabel } from "../../lib/content/labels.js";
import "../../styles/blog.css";

const props = defineProps({
  post: { type: Object, required: true },
  headingLevel: { type: Number, default: 2 },
});

const series = computed(() => seriesInfo(props.post.series));
</script>

<style scoped>
.postItem {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-5) 0;
  border-bottom: var(--border);
}

.postMeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
}

.stateLabel {
  margin-left: var(--space-2);
}

.postTitle {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: var(--fs-h3);
  overflow-wrap: anywhere;
}

.postTitle a {
  color: var(--color-text);
  text-decoration: none;
}

.postTitle a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.postDesc {
  max-width: var(--w-prose);
  color: var(--color-text-muted);
}

.tag-list {
  margin-top: var(--space-1);
}
</style>
