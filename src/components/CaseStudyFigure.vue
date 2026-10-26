<template>
  <figure class="csFigure">
    <video
      v-if="video"
      class="csVideo"
      :src="video"
      :poster="image || undefined"
      :width="width"
      :height="height"
      :aria-label="alt"
      controls
      playsinline
      preload="metadata"
    ></video>
    <img
      v-else
      :src="image"
      :alt="alt"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      <span v-if="caption">{{ caption }}</span>
      <a :href="video || image" target="_blank" rel="noopener" class="figureLink">
        {{ video ? "Open the video" : "Open full-size figure"
        }}<span class="visually-hidden"> (opens in a new tab)</span> ↗
      </a>
    </figcaption>
  </figure>
</template>

<script setup>
/**
 * The case-study overview figure: a demo video when the project has one,
 * otherwise a still image. A video leads the page (see ProjectDetail), so this
 * component carries its own styles rather than relying on the parent's scope.
 */
defineProps({
  /** Video URL, e.g. "/previews/courtside-demo.mp4". Wins over `image`, which becomes its poster. */
  video: { type: String, default: null },
  image: { type: String, default: null },
  caption: { type: String, default: null },
  alt: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
});
</script>

<style scoped>
.csFigure {
  margin: var(--space-6) 0 0;
}

.csFigure img,
.csVideo {
  display: block;
  width: 100%;
  height: auto;
  border: var(--border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.csFigure figcaption {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  justify-content: space-between;
  max-width: var(--w-prose);
  margin-top: var(--space-3);
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  line-height: 1.55;
}

.figureLink {
  font-weight: 600;
  white-space: nowrap;
}
</style>
