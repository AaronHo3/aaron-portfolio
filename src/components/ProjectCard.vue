<template>
  <RouterLink class="card linkCard" :to="`/projects/${props.project.slug}`" :style="{ '--tone': tone }">
    <div class="visual">
      <component :is="projectIcon(props.project.slug)" class="visualIcon" />
      <div class="visualBars" aria-hidden="true">
        <span :style="{ width: miniBarWidths(props.project.slug)[0] }"></span>
        <span :style="{ width: miniBarWidths(props.project.slug)[1] }"></span>
        <span :style="{ width: miniBarWidths(props.project.slug)[2] }"></span>
      </div>
    </div>

    <div class="top">
      <h3>{{ props.project.title }}</h3>
      <span class="chev">View</span>
    </div>

    <p class="muted">{{ props.project.subtitle }}</p>

    <div class="tags">
      <span v-for="t in props.project.tags" :key="t" class="tag">{{ t }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from "vue";
import { Activity, BrainCircuit, ChartScatter, ScanSearch } from "lucide-vue-next";

const props = defineProps({
  project: { type: Object, required: true },
});

const toneByTag = {
  "Machine Learning": "#4d8b62",
  "Deep Learning": "#3567ac",
  "Data Viz": "#a65f2a",
  "Healthcare": "#6b53ab",
  "Computer Vision": "#267c80",
};

const tone = computed(() => {
  const match = props.project.tags.find((t) => toneByTag[t]);
  return match ? toneByTag[match] : "var(--accent)";
});

const iconBySlug = {
  "eeg-seizure-classification": BrainCircuit,
  "luna16-nodule-segmentation": ScanSearch,
  "imagined-handwriting-decoding": Activity,
  "gapminder-dashboard": ChartScatter,
};

const barsBySlug = {
  "eeg-seizure-classification": ["84%", "74%", "92%"],
  "luna16-nodule-segmentation": ["90%", "82%", "76%"],
  "imagined-handwriting-decoding": ["72%", "88%", "80%"],
  "gapminder-dashboard": ["62%", "85%", "90%"],
};

function projectIcon(slug) {
  return iconBySlug[slug] || ChartScatter;
}

function miniBarWidths(slug) {
  return barsBySlug[slug] || ["74%", "68%", "86%"];
}
</script>

<style scoped>
.linkCard {
  display: block;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
}

.linkCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--tone) 84%, white), var(--tone));
  opacity: 0.7;
}

.linkCard::after {
  content: "";
  position: absolute;
  inset: -40% auto auto -10%;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--tone) 14%, transparent), transparent 66%);
  transition: opacity 160ms ease;
  opacity: 0.5;
}

.linkCard:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--tone) 42%, var(--border));
  box-shadow: 0 16px 30px color-mix(in srgb, var(--tone) 20%, transparent);
  background: color-mix(in srgb, var(--card) 88%, var(--tone) 4%);
}

.linkCard:hover::after {
  opacity: 0.86;
}

.visual {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--r-md);
  border: 1px dashed color-mix(in srgb, var(--tone) 38%, var(--border));
  background: color-mix(in srgb, var(--tone) 12%, transparent);
  margin-bottom: 12px;
}

.visualIcon {
  width: 42px;
  height: 42px;
  padding: 9px;
  border-radius: 11px;
  color: color-mix(in srgb, white 90%, var(--bg));
  background: linear-gradient(140deg, var(--tone), color-mix(in srgb, var(--tone) 62%, black));
}

.visualBars {
  flex: 1;
  display: grid;
  gap: 6px;
}

.visualBars span {
  display: block;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--tone) 82%, white), color-mix(in srgb, var(--tone) 82%, black));
  opacity: 0.9;
}

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

h3 {
  margin: 0;
  letter-spacing: -0.01em;
  font-size: 16px;
}

.muted {
  margin: 10px 0 0;
  color: var(--muted);
  line-height: 1.5;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tag {
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 6px 10px;
  font-weight: 850;
  font-size: 12px;
  color: var(--muted);
  background: color-mix(in srgb, var(--tone) 8%, transparent);
}

.chev {
  color: var(--muted);
  font-weight: 900;
  font-size: 12px;
}
</style>
