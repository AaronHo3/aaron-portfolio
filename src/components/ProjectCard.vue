<template>
  <RouterLink class="card linkCard" :to="`/projects/${props.project.slug}`" :style="{ '--tone': tone }">
    <div class="visual">
      <div class="visualMark">
        <component :is="projectIcon(props.project.slug)" class="visualIcon" />
      </div>
      <div class="visualCopy">
        <p class="visualLabel">{{ visualLabel(props.project.slug) }}</p>
        <p class="visualMeta">{{ props.project.tags?.[0] || "Project" }}</p>
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
import { Activity, BrainCircuit, ChartScatter, Dribbble, ScanSearch, Volleyball } from "lucide-vue-next";

const props = defineProps({
  project: { type: Object, required: true },
});

const toneByTag = {
  "Healthcare AI": "#3567ac",
  "Medical Imaging": "#267c80",
  Neuroscience: "#6b53ab",
  "Sports Analytics": "#0a7b83",
  "Data Visualization / Dashboards": "#b3472b",
  Miscellaneous: "#7a7f87",
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
  "mens-2023-vnl-dashboard": Volleyball,
  "nba-statistics-dashboard": Dribbble,
};

const labelBySlug = {
  "eeg-seizure-classification": "EEG ML pipeline",
  "luna16-nodule-segmentation": "CT segmentation model",
  "imagined-handwriting-decoding": "Neural decoding models",
  "gapminder-dashboard": "Interactive global trends",
  "mens-2023-vnl-dashboard": "Volleyball analytics hub",
  "nba-statistics-dashboard": "NBA stats dashboard",
};

function projectIcon(slug) {
  return iconBySlug[slug] || ChartScatter;
}

function visualLabel(slug) {
  return labelBySlug[slug] || "Interactive project";
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
  gap: 12px;
  padding: 10px;
  border-radius: var(--r-md);
  border: 1px solid color-mix(in srgb, var(--tone) 32%, var(--border));
  background: color-mix(in srgb, var(--tone) 12%, transparent);
  margin-bottom: 12px;
}

.visualMark {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(140deg, var(--tone), color-mix(in srgb, var(--tone) 62%, black));
  box-shadow: 0 10px 20px color-mix(in srgb, var(--tone) 28%, transparent);
}

.visualIcon {
  width: 24px;
  height: 24px;
  color: color-mix(in srgb, white 90%, var(--bg));
}

.visualCopy {
  min-width: 0;
}

.visualLabel {
  margin: 0;
  font-weight: 850;
  color: var(--text);
  font-size: 13px;
  letter-spacing: -0.01em;
}

.visualMeta {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
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
