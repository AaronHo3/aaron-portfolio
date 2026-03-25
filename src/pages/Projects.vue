<template>
  <section class="section">
    <div class="head">
      <h2 class="sectionTitle">Projects</h2>
      <div class="headControls">
        <div class="viewToggle">
          <button
            class="viewBtn"
            :class="{ active: viewMode === 'stack' }"
            @click="viewMode = 'stack'"
            aria-label="Stack view"
          >
            <Layers :size="16" />
          </button>
          <button
            class="viewBtn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            aria-label="Grid view"
          >
            <LayoutGrid :size="16" />
          </button>
        </div>
        <input v-model="q" class="input" placeholder="Search…" />
      </div>
    </div>

    <div class="filterGroup">
      <p class="filterLabel">Project Category</p>
      <div class="chips">
        <button class="chip" :class="{ active: modelType === 'All' }" @click="modelType = 'All'">All</button>
        <button
          v-for="m in modelTypes"
          :key="m"
          class="chip"
          :class="{ active: modelType === m }"
          @click="modelType = m"
        >
          {{ m }}
        </button>
      </div>
    </div>

    <div class="filterGroup">
      <p class="filterLabel">Language</p>
      <div class="chips">
        <button class="chip" :class="{ active: language === 'All' }" @click="language = 'All'">All</button>
        <button
          v-for="l in languages"
          :key="l"
          class="chip"
          :class="{ active: language === l }"
          @click="language = l"
        >
          {{ l }}
        </button>
      </div>
    </div>

    <!-- Display Cards (Stack) View -->
    <div v-if="viewMode === 'stack'" class="stackView">
      <div class="displayCardsStack">
        <component
          :is="cardComponent(p)"
          v-for="(p, idx) in filtered"
          :key="p.slug"
          class="displayCard"
          :class="[`dc${idx}`, { locked: p.underConstruction }]"
          :style="cardStackStyle(idx)"
          v-bind="cardProps(p)"
        >
          <div class="dcTop">
            <span class="dcIconWrap" :style="{ '--tone': projectTone(p) }">
              <component :is="projectIcon(p.slug)" class="dcIcon" />
            </span>
            <p class="dcType" :style="{ color: projectTone(p) }">{{ p.tags?.[0] || 'Project' }}</p>
          </div>
          <p class="dcTitle">{{ p.title }}</p>
          <p class="dcSub">{{ p.subtitle }}</p>
          <p v-if="p.underConstruction" class="dcConstruction">Under construction</p>
        </component>
      </div>
    </div>

    <!-- Grid View (original) -->
    <div v-else class="grid">
      <ProjectCard v-for="p in filtered" :key="p.slug" :project="p" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  Activity,
  BrainCircuit,
  ChartScatter,
  Dribbble,
  FlaskConical,
  Heart,
  Layers,
  LayoutGrid,
  ScanSearch,
  Volleyball,
} from "lucide-vue-next";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard.vue";

const q = ref("");
const modelType = ref("All");
const language = ref("All");
const viewMode = ref("grid");

const allowedModelTypes = [
  "Healthcare AI",
  "Medical Imaging",
  "Neuroscience",
  "Sports Analytics",
  "Data Visualization / Dashboards",
  "Miscellaneous",
];

const modelTypes = computed(() => allowedModelTypes);

const languages = computed(() => {
  const s = new Set();
  for (const p of projects) for (const l of p.languages || []) s.add(l);
  return Array.from(s).sort();
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();

  return projects.filter((p) => {
    const matchesQuery =
      !query ||
      (p.title
        + " "
        + p.subtitle
        + " "
        + p.tags.join(" ")
        + " "
        + (p.modelTypes || []).join(" ")
        + " "
        + (p.languages || []).join(" ")
        + " "
        + p.stack.join(" "))
        .toLowerCase()
        .includes(query);

    const matchesModelType = modelType.value === "All" || (p.modelTypes || []).includes(modelType.value);
    const matchesLanguage = language.value === "All" || (p.languages || []).includes(language.value);

    return matchesQuery && matchesModelType && matchesLanguage;
  });
});

/* ---- Icon / tone helpers ---- */
const iconBySlug = {
  "gutsense-crc-screening": FlaskConical,
  "eeg-seizure-classification": BrainCircuit,
  "luna16-nodule-segmentation": ScanSearch,
  "chest-cancer-efficientnet-deit-smallvit": ScanSearch,
  "imagined-handwriting-decoding": Activity,
  "gapminder-dashboard": ChartScatter,
  "mens-2023-vnl-dashboard": Volleyball,
  "nba-statistics-dashboard": Dribbble,
  "uci-heart-disease-ml": Heart,
};

const toneByTag = {
  "Healthcare AI": "#38bdf8",
  "Medical Imaging": "#6366f1",
  Neuroscience: "#818cf8",
  "Sports Analytics": "#0ea5e9",
  "Data Visualization / Dashboards": "#22d3ee",
  Hackathon: "#10b981",
  Miscellaneous: "#64748b",
};

function projectIcon(slug) {
  return iconBySlug[slug] || ChartScatter;
}

function projectTone(project) {
  const match = project.tags.find((t) => toneByTag[t]);
  return match ? toneByTag[match] : "var(--accent)";
}

function cardComponent(project) {
  return project.underConstruction ? "article" : RouterLink;
}

function cardProps(project) {
  return project.underConstruction ? {} : { to: `/projects/${project.slug}` };
}

function cardStackStyle(idx) {
  const xOffset = idx * 18;
  const yOffset = idx * 30;
  return {
    "--stack-x": `${xOffset}px`,
    "--stack-y": `${yOffset}px`,
    zIndex: idx + 1,
  };
}
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.headControls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.head :deep(.input) {
  min-width: min(260px, 100%);
}

.viewToggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  overflow: hidden;
}

.viewBtn {
  display: grid;
  place-items: center;
  padding: 7px 10px;
  border: none;
  background: color-mix(in srgb, var(--card) 90%, var(--bg-elev));
  color: var(--muted);
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease;
}

.viewBtn:first-child {
  border-right: 1px solid var(--border);
}

.viewBtn:hover {
  color: var(--text);
}

.viewBtn.active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 18%, var(--bg-elev));
}

.filterGroup {
  margin-top: 12px;
  width: 100%;
}

.filterLabel {
  margin: 0 0 8px;
  color: var(--muted);
  font-weight: 800;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0;
  width: 100%;
}

.chip {
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 90%, var(--bg-elev));
  color: var(--muted);
  padding: 8px 12px;
  border-radius: var(--r-pill);
  font-weight: 900;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, color 160ms ease;
}

.chip:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 34%, var(--border));
  box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--text);
}

.chip.active {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 52%, var(--border));
  background: color-mix(in srgb, var(--accent) 26%, var(--bg-elev));
  box-shadow: 0 14px 24px color-mix(in srgb, var(--accent) 18%, transparent);
}

/* ---- Display Cards Stack View ---- */
.stackView {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  padding: 40px 0 60px;
}

.displayCardsStack {
  display: grid;
  grid-template-areas: "stack";
  place-items: center;
}

.displayCard {
  grid-area: stack;
  position: relative;
  width: 380px;
  max-width: 85vw;
  padding: 22px 24px;
  border-radius: var(--r-lg);
  border: 2px solid var(--border);
  background: color-mix(in srgb, var(--card) 92%, var(--bg-elev));
  backdrop-filter: blur(8px);
  text-decoration: none;
  color: var(--text);
  transform: skewY(-8deg) translateX(var(--stack-x)) translateY(var(--stack-y));
  transition: transform 500ms cubic-bezier(0.2, 0.9, 0.2, 1),
    border-color 300ms ease,
    background 300ms ease,
    box-shadow 300ms ease,
    filter 500ms ease;
  cursor: pointer;
  user-select: none;
}

/* All cards except the top one get greyed out */
.displayCard:not(:last-child) {
  filter: grayscale(100%);
}
.displayCard:not(:last-child)::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--r-lg);
  background: color-mix(in srgb, var(--bg) 45%, transparent);
  pointer-events: none;
  transition: opacity 500ms ease;
}

.displayCard:hover {
  border-color: color-mix(in srgb, var(--accent) 44%, var(--border));
  box-shadow: 0 18px 36px color-mix(in srgb, var(--accent) 20%, transparent);
  transform: skewY(-8deg) translateX(var(--stack-x)) translateY(calc(var(--stack-y) - 36px));
  filter: grayscale(0%);
}
.displayCard:hover::after {
  opacity: 0;
}

.displayCard.locked {
  cursor: not-allowed;
  border-style: dashed;
}
.displayCard.locked:hover {
  transform: skewY(-8deg) translateX(var(--stack-x)) translateY(var(--stack-y));
  box-shadow: none;
}

.dcTop {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dcIconWrap {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(140deg, var(--tone, var(--accent)), color-mix(in srgb, var(--tone, var(--accent)) 60%, var(--accent-2)));
}

.dcIcon {
  width: 14px;
  height: 14px;
  color: white;
}

.dcType {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.dcTitle {
  margin: 10px 0 0;
  font-size: 17px;
  font-weight: 850;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.dcSub {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dcConstruction {
  margin: 8px 0 0;
  display: inline-flex;
  border-radius: var(--r-pill);
  border: 1px dashed color-mix(in srgb, var(--accent) 52%, var(--border));
  background: color-mix(in srgb, var(--accent-soft) 58%, transparent);
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--text);
}

/* Mobile: fall back to grid */
@media (max-width: 640px) {
  .stackView {
    display: none;
  }

  /* Show grid view automatically on mobile */
  .headControls .viewToggle {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .displayCard {
    transition: none !important;
    filter: none !important;
    transform: none !important;
  }
}
</style>
