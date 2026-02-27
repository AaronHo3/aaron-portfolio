<template>
  <section class="section projectsWide">
    <div class="head">
      <h2 class="sectionTitle">Projects</h2>
      <input v-model="q" class="input" placeholder="Search…" />
    </div>

    <div class="filterGroup">
      <p class="filterLabel">Model Type</p>
      <div class="chips">
        <button class="chip" :class="{ active: modelType === 'All' }" @click="modelType = 'All'">All</button>
        <button
          v-for="m in visibleModelTypes"
          :key="m"
          class="chip"
          :class="{ active: modelType === m }"
          @click="modelType = m"
        >
          {{ m }}
        </button>
        <button
          v-if="modelTypes.length > MODEL_TYPE_PREVIEW_COUNT"
          class="chip moreChip"
          type="button"
          :aria-expanded="showMoreModelTypes ? 'true' : 'false'"
          @click="showMoreModelTypes = !showMoreModelTypes"
        >
          {{ showMoreModelTypes ? "Less" : "More" }}
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

    <div class="grid">
      <ProjectCard v-for="p in filtered" :key="p.slug" :project="p" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard.vue";

const q = ref("");
const modelType = ref("All");
const language = ref("All");
const showMoreModelTypes = ref(false);
const MODEL_TYPE_PREVIEW_COUNT = 4;

const modelTypes = computed(() => {
  const s = new Set();
  for (const p of projects) for (const m of p.modelTypes || []) s.add(m);
  return Array.from(s).sort();
});

const languages = computed(() => {
  const s = new Set();
  for (const p of projects) for (const l of p.languages || []) s.add(l);
  return Array.from(s).sort();
});

const visibleModelTypes = computed(() => {
  if (showMoreModelTypes.value) return modelTypes.value;

  const preview = modelTypes.value.slice(0, MODEL_TYPE_PREVIEW_COUNT);
  if (
    modelType.value !== "All"
    && !preview.includes(modelType.value)
    && modelTypes.value.includes(modelType.value)
  ) {
    return [...preview, modelType.value];
  }
  return preview;
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
</script>

<style scoped>
.projectsWide {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: min(1360px, calc(100vw - 40px));
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.head :deep(.input) {
  min-width: min(320px, 100%);
}

.filterGroup {
  margin-top: 12px;
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
}

/* simple chip button */
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

.moreChip {
  border-style: dashed;
}

@media (max-width: 760px) {
  .projectsWide {
    width: calc(100vw - 24px);
  }
}
</style>
