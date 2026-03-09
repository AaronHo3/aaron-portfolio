<template>
  <component
    :is="cardComponent"
    class="card linkCard"
    :class="{ locked: isUnderConstruction }"
    v-bind="cardProps"
    :style="{ '--tone': tone }"
  >
    <div class="visual">
      <div class="visualTexture" aria-hidden="true"></div>

      <div class="visualTop">
        <div class="visualMark">
          <component :is="projectIcon(props.project.slug)" class="visualIcon" />
        </div>
        <div class="visualCopy">
          <p class="eyebrow">{{ visualLabel(props.project.slug) }}</p>
          <p class="visualMeta">{{ projectMeta(props.project) }}</p>
        </div>
      </div>
    </div>

    <div class="content">
      <p v-if="isUnderConstruction" class="construction">Hard-hat zone: under construction</p>

      <div class="top">
        <h3>{{ props.project.title }}</h3>
        <span class="chev">{{ isUnderConstruction ? "Soon" : "View" }}</span>
      </div>

      <p class="muted">{{ props.project.subtitle }}</p>

      <div class="tags">
        <span v-for="t in props.project.tags" :key="t" class="tag">{{ t }}</span>
      </div>
    </div>
  </component>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { Activity, BrainCircuit, ChartScatter, Dribbble, Heart, ScanSearch, Volleyball } from "lucide-vue-next";

const props = defineProps({
  project: { type: Object, required: true },
});

const toneByTag = {
  "Healthcare AI": "#38bdf8",
  "Medical Imaging": "#6366f1",
  Neuroscience: "#818cf8",
  "Sports Analytics": "#0ea5e9",
  "Data Visualization / Dashboards": "#22d3ee",
  Miscellaneous: "#64748b",
};

const tone = computed(() => {
  const match = props.project.tags.find((t) => toneByTag[t]);
  return match ? toneByTag[match] : "var(--accent)";
});
const isUnderConstruction = computed(() => Boolean(props.project.underConstruction));
const cardComponent = computed(() => (isUnderConstruction.value ? "article" : RouterLink));
const cardProps = computed(() =>
  isUnderConstruction.value ? {} : { to: `/projects/${props.project.slug}` }
);

const iconBySlug = {
  "eeg-seizure-classification": BrainCircuit,
  "luna16-nodule-segmentation": ScanSearch,
  "chest-cancer-efficientnet-deit-smallvit": ScanSearch,
  "imagined-handwriting-decoding": Activity,
  "gapminder-dashboard": ChartScatter,
  "mens-2023-vnl-dashboard": Volleyball,
  "nba-statistics-dashboard": Dribbble,
  "uci-heart-disease-ml": Heart,
};

const labelBySlug = {
  "eeg-seizure-classification": "EEG ML pipeline",
  "luna16-nodule-segmentation": "CT segmentation model",
  "chest-cancer-efficientnet-deit-smallvit": "Chest imaging models",
  "imagined-handwriting-decoding": "Neural decoding models",
  "gapminder-dashboard": "Interactive global trends",
  "mens-2023-vnl-dashboard": "Volleyball analytics hub",
  "nba-statistics-dashboard": "NBA stats dashboard",
  "uci-heart-disease-ml": "Cardiac risk modeling",
};

function projectIcon(slug) {
  return iconBySlug[slug] || ChartScatter;
}

function visualLabel(slug) {
  return labelBySlug[slug] || "Interactive project";
}

function projectMeta(project) {
  const languages = (project.languages || []).slice(0, 2).join(" / ");
  return languages || (project.tags || []).slice(0, 2).join(" / ") || "Interactive case study";
}
</script>

<style scoped>
.linkCard {
  display: block;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  padding: 0;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease;
}

.linkCard.locked {
  cursor: not-allowed;
  border-style: dashed;
}

.linkCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--tone) 92%, white), color-mix(in srgb, var(--tone) 20%, transparent));
  opacity: 0.9;
}

.linkCard::after {
  content: "";
  position: absolute;
  inset: auto -16% -24% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--tone) 12%, transparent), transparent 66%);
  transition: opacity 160ms ease, transform 220ms ease;
  opacity: 0.55;
}

.linkCard:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--tone) 42%, var(--border));
  box-shadow: 0 16px 30px color-mix(in srgb, var(--tone) 20%, transparent);
  background: color-mix(in srgb, var(--card) 88%, var(--tone) 4%);
}

.linkCard.locked:hover {
  transform: none;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--tone) 18%, transparent);
}

.linkCard:hover::after {
  opacity: 0.86;
  transform: scale(1.08);
}

.visual {
  position: relative;
  min-height: 120px;
  padding: 18px 18px 16px;
  overflow: hidden;
  border-radius: calc(var(--r-lg) - 1px) calc(var(--r-lg) - 1px) 0 0;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--tone) 22%, transparent), transparent 32%),
    linear-gradient(135deg, color-mix(in srgb, var(--tone) 14%, var(--bg-elev)), color-mix(in srgb, var(--card) 86%, var(--bg)));
  border-bottom: 1px solid color-mix(in srgb, var(--tone) 24%, var(--border));
}

.visualTexture,
.visualTop,
.visualCopy {
  position: relative;
  z-index: 1;
}

.visualTexture {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(120deg, transparent 0 58%, color-mix(in srgb, white 7%, transparent) 58% 62%, transparent 62%),
    linear-gradient(0deg, color-mix(in srgb, white 6%, transparent) 1px, transparent 1px);
  background-size: 100% 100%, 100% 20px;
  opacity: 0.45;
  mask-image: linear-gradient(180deg, black, transparent 90%);
}

.visualTop {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}

.eyebrow {
  margin: 0;
  max-width: none;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: white;
}

.visualMark {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, white 10%, transparent);
  background:
    linear-gradient(160deg, color-mix(in srgb, white 10%, var(--tone)), color-mix(in srgb, var(--tone) 16%, rgba(255, 255, 255, 0.04)));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 12px 24px color-mix(in srgb, var(--tone) 16%, transparent);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.visualIcon {
  width: 22px;
  height: 22px;
  color: white;
}

.visualCopy {
  min-width: 0;
  flex: 1 1 auto;
}

.content {
  padding: 18px;
}

.construction {
  margin: 0 0 12px;
  display: inline-flex;
  width: fit-content;
  border-radius: var(--r-pill);
  border: 1px dashed color-mix(in srgb, var(--tone) 52%, var(--border));
  background: color-mix(in srgb, var(--tone) 14%, transparent);
  color: var(--text);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.visualMeta {
  margin: 6px 0 0;
  color: color-mix(in srgb, white 72%, var(--tone));
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

h3 {
  margin: 0;
  letter-spacing: -0.02em;
  font-size: 21px;
  line-height: 1.05;
}

.muted {
  margin: 10px 0 0;
  color: var(--muted);
  line-height: 1.55;
  font-size: 14px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.tag {
  border: 1px solid color-mix(in srgb, var(--tone) 12%, var(--border));
  border-radius: var(--r-pill);
  padding: 5px 10px;
  font-weight: 850;
  font-size: 11px;
  letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--text) 70%, var(--muted));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--tone) 10%, transparent), color-mix(in srgb, var(--tone) 4%, transparent));
}

.chev {
  color: color-mix(in srgb, var(--tone) 48%, white);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.linkCard:hover .visualMark {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 14px 28px color-mix(in srgb, var(--tone) 22%, transparent);
}

.linkCard:hover .visualTexture {
  opacity: 0.62;
}

@media (max-width: 640px) {
  .visual {
    min-height: 112px;
    padding: 16px;
  }

  .eyebrow {
    font-size: 16px;
  }

  h3 {
    font-size: 18px;
  }
}
</style>
