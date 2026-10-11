<template>
  <div class="container page">
    <header class="pageHead">
      <h1 class="page-title">Projects</h1>
      <p class="lead">
        Here are some of the things I've been working on, from clinical ML and brain-computer interfaces to music
        and a couple of basketball side projects. Each one has a short write-up of what I built and what I learned.
      </p>
    </header>

    <form class="controls" role="search" aria-label="Filter projects" @submit.prevent>
      <div class="field searchField">
        <label for="project-search">Search</label>
        <input id="project-search" v-model="query" class="input" type="search" placeholder="Title, method, tool…" />
      </div>
      <div class="field">
        <label for="project-category">Category</label>
        <select id="project-category" v-model="category" class="input">
          <option value="">All categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="field">
        <label for="project-language">Language</label>
        <select id="project-language" v-model="language" class="input">
          <option value="">All languages</option>
          <option v-for="l in languages" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>
      <fieldset class="field viewField">
        <legend>View</legend>
        <div class="segmented">
          <button type="button" :aria-pressed="view === 'grid'" @click="view = 'grid'">
            <LayoutGrid :size="16" aria-hidden="true" /> Grid
          </button>
          <button type="button" :aria-pressed="view === 'list'" @click="view = 'list'">
            <List :size="16" aria-hidden="true" /> List
          </button>
        </div>
      </fieldset>
    </form>

    <div class="resultBar">
      <p class="meta" aria-live="polite">
        {{ filtered.length }} of {{ visible.length }} {{ visible.length === 1 ? "project" : "projects" }}
      </p>
      <button v-if="isFiltered" type="button" class="btn btn-sm" @click="reset">Reset filters</button>
    </div>

    <ul v-if="filtered.length" class="projectGrid" :class="view">
      <li v-for="(p, i) in filtered" :key="p.slug">
        <ProjectCard :project="p" :heading-level="2" :layout="view" :eager="i < 2" />
      </li>
    </ul>

    <div v-else class="empty">
      <p><strong>No projects match these filters.</strong></p>
      <p class="muted">Try a broader search term, or reset the filters to see all {{ visible.length }} projects.</p>
      <button type="button" class="btn btn-sm" @click="reset">Reset filters</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { LayoutGrid, List } from "lucide-vue-next";
import ProjectCard from "../components/ProjectCard.vue";
import { projects } from "../data/projects";

const query = ref("");
const category = ref("");
const language = ref("");
const view = ref("grid");

// Finished work first, in-progress last (stable sort keeps file order within groups).
const visible = projects
  .filter((p) => !p.hidden)
  .sort((a, b) => Number(Boolean(a.inProgress)) - Number(Boolean(b.inProgress)));

/** Unique, sorted values across visible projects, so new projects need no UI edits. */
const uniqueSorted = (pick) => [...new Set(visible.flatMap(pick))].sort((a, b) => a.localeCompare(b));
// Category = each project's primary modelType; filtering still matches any of its modelTypes.
const categories = uniqueSorted((p) => (p.modelTypes?.length ? [p.modelTypes[0]] : []));
const languages = uniqueSorted((p) => p.languages || []);

function searchText(p) {
  return [p.title, p.displayTitle, p.subtitle, p.cardSummary, ...(p.tags || []), ...(p.modelTypes || []), ...(p.languages || []), ...(p.stack || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return visible.filter(
    (p) =>
      (!q || searchText(p).includes(q)) &&
      (!category.value || (p.modelTypes || []).includes(category.value)) &&
      (!language.value || (p.languages || []).includes(language.value)),
  );
});

const isFiltered = computed(() => Boolean(query.value.trim() || category.value || language.value));

function reset() {
  query.value = "";
  category.value = "";
  language.value = "";
}
</script>

<style scoped>
.pageHead .lead {
  margin-top: var(--space-4);
}

.controls {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr)) auto;
  gap: var(--space-4);
  align-items: end;
  margin-top: var(--space-7);
  padding-bottom: var(--space-5);
  border-bottom: var(--border);
}

.field {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.field label,
.field legend {
  padding: 0;
  font-size: var(--fs-meta);
  font-weight: 650;
  color: var(--color-text-muted);
}

.segmented {
  display: inline-flex;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.segmented button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 42px;
  padding: 0 var(--space-4);
  border: 0;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font: inherit;
  font-size: var(--fs-small);
  font-weight: 600;
  cursor: pointer;
}

.segmented button + button {
  border-left: 1px solid var(--color-control-border);
}

.segmented button[aria-pressed="true"] {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.segmented button:focus-visible {
  outline-offset: -3px;
}

.resultBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 44px;
  margin: var(--space-4) 0 var(--space-5);
}

.projectGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

.projectGrid.list {
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

.empty {
  display: grid;
  gap: var(--space-3);
  justify-items: start;
  padding: var(--space-6);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
}

@media (max-width: 900px) {
  .controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .searchField {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .projectGrid {
    grid-template-columns: 1fr;
  }
  .viewField {
    display: none; /* list and grid are identical at one column */
  }
}

@media (max-width: 480px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
