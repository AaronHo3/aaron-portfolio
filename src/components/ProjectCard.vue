<template>
  <article class="projectCard" :class="{ horizontal: layout === 'list' }">
    <div class="thumb">
      <img
        v-if="thumbSrc"
        :src="thumbSrc"
        alt=""
        width="800"
        height="450"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
      />
    </div>
    <div class="body">
      <p v-if="category" class="meta category">{{ category }}</p>
      <component :is="`h${headingLevel}`" class="title">
        <RouterLink class="titleLink" :to="`/projects/${project.slug}`">{{ displayTitle }}</RouterLink>
      </component>
      <p class="summary">{{ summary }}</p>
      <p v-if="project.highlight" class="highlight">{{ project.highlight }}</p>
      <span class="cta" aria-hidden="true">Read the case study <span class="arrow">→</span></span>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  project: { type: Object, required: true },
  headingLevel: { type: Number, default: 3 },
  /** "grid" stacks the image above text; "list" puts it beside the text on wide screens. */
  layout: { type: String, default: "grid" },
  eager: { type: Boolean, default: false },
});

const displayTitle = computed(() => props.project.displayTitle || props.project.title);
const summary = computed(() => props.project.cardSummary || props.project.subtitle);
const thumbSrc = computed(() => props.project.thumbnail || props.project.image || "");
const category = computed(() => (props.project.modelTypes || props.project.tags || [])[0] || "");
</script>

<style scoped>
.projectCard {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  border: var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}

.projectCard:hover {
  border-color: var(--color-control-border);
  box-shadow: var(--shadow-md);
}

/* The link's own outline is hidden (it spans the card), so the card shows focus. */
.projectCard:has(.titleLink:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.thumb {
  aspect-ratio: 16 / 9;
  background: var(--color-surface-muted);
  border-bottom: var(--border);
}

.thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

html[data-theme="dark"] .thumb img {
  filter: brightness(0.92);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
  padding: var(--space-5);
}

.category {
  font-weight: 600;
}

.title {
  font-family: var(--font-sans);
  font-size: clamp(1.375rem, 1.25rem + 0.4vw, 1.625rem);
  font-weight: 700;
  line-height: 1.2;
}

.titleLink {
  color: var(--color-text);
  text-decoration: none;
}

/* Whole card is clickable through this one link (single tab stop). */
.titleLink::after {
  content: "";
  position: absolute;
  inset: 0;
}

.titleLink:focus-visible {
  outline: none;
}

.projectCard:hover .titleLink {
  color: var(--color-accent);
}

.summary {
  color: var(--color-text-muted);
}

.highlight {
  padding-left: var(--space-3);
  border-left: 3px solid var(--color-accent);
  font-size: var(--fs-small);
  font-weight: 600;
  line-height: 1.5;
}

.cta {
  margin-top: auto;
  padding-top: var(--space-2);
  color: var(--color-accent);
  font-weight: 650;
  font-size: var(--fs-small);
}

.cta .arrow {
  display: inline-block;
  transition: transform var(--dur-fast) var(--ease);
}

.projectCard:hover .cta .arrow {
  transform: translateX(3px);
}

@media (min-width: 900px) {
  .horizontal {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
  .horizontal .thumb {
    aspect-ratio: auto;
    border-bottom: 0;
    border-right: var(--border);
  }
}
</style>
