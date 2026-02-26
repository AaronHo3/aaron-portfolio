<template>
  <section class="section">
    <div class="head">
      <h2 class="sectionTitle">Projects</h2>
      <input v-model="q" class="input" placeholder="Search…" />
    </div>

    <div class="chips">
      <button class="chip" :class="{ active: tag === 'All' }" @click="tag = 'All'">All</button>
      <button v-for="t in tags" :key="t" class="chip" :class="{ active: tag === t }" @click="tag = t">
        {{ t }}
      </button>
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
const tag = ref("All");

const tags = computed(() => {
  const s = new Set();
  for (const p of projects) for (const t of p.tags) s.add(t);
  return Array.from(s).sort();
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();

  return projects.filter((p) => {
    const matchesQuery =
      !query ||
      (p.title + " " + p.subtitle + " " + p.tags.join(" "))
        .toLowerCase()
        .includes(query);

    const matchesTag = tag.value === "All" || p.tags.includes(tag.value);
    return matchesQuery && matchesTag;
  });
});
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0 2px;
}

/* simple chip button */
.chip {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  padding: 8px 12px;
  border-radius: var(--r-pill);
  font-weight: 900;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, color 160ms ease;
}

.chip:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow);
  color: var(--text);
}

.chip.active {
  color: var(--text);
  box-shadow: var(--shadow);
}
</style>