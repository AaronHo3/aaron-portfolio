<template>
  <section>
    <div class="head">
      <h2>Projects</h2>
      <input v-model="q" class="search" placeholder="Search…" />
    </div>

    <div class="chips">
      <button class="chip" :class="{ active: tag === 'All' }" @click="tag='All'">All</button>
      <button v-for="t in tags" :key="t" class="chip" :class="{ active: tag === t }" @click="tag=t">
        {{ t }}
      </button>
    </div>

    <div class="grid">
      <article v-for="p in filtered" :key="p.title" class="card">
        <h3>{{ p.title }}</h3>
        <p class="muted">{{ p.description }}</p>
        <div class="row">
          <span v-for="t in p.tags" :key="t" class="pill">{{ t }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const q = ref("");
const tag = ref("All");

const projects = ref([
  { title: "EEG Seizure Classification (CHB-MIT)", description: "Ensemble ML + ROC/AUC evaluation.", tags: ["EEG", "ML"] },
  { title: "Lung Nodule Segmentation + Classification (LUNA16)", description: "U-Net + ResNet50 pipeline.", tags: ["CT", "Deep Learning"] },
  { title: "Neural Decoding (Imagined Handwriting)", description: "Poisson HMM vs RCNN sequence decoder.", tags: ["BCI", "Sequence Models"] },
  { title: "Interactive Gapminder Dashboard (Vue + D3)", description: "Linked interactions, filtering, responsive layout.", tags: ["Visualization", "Vue", "D3"] },
]);

const tags = computed(() => {
  const s = new Set();
  for (const p of projects.value) for (const t of p.tags) s.add(t);
  return Array.from(s).sort();
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  return projects.value.filter((p) => {
    const matchesQuery = !query || (p.title + " " + p.description + " " + p.tags.join(" ")).toLowerCase().includes(query);
    const matchesTag = tag.value === "All" || p.tags.includes(tag.value);
    return matchesQuery && matchesTag;
  });
});
</script>

<style scoped>
.head { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
h2 { margin: 0; letter-spacing: -0.02em; }
.search { padding: 10px 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--card); color: var(--text); font-weight: 800; }

.chips { display: flex; gap: 10px; flex-wrap: wrap; margin: 14px 0; }
.chip { border: 1px solid var(--border); background: var(--card); color: var(--muted); padding: 8px 12px; border-radius: 999px; font-weight: 900; cursor: pointer; }
.chip.active { color: var(--text); box-shadow: var(--shadow); }

.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 14px; margin-top: 14px; }
.card h3 { margin: 0 0 8px; letter-spacing: -0.01em; }
.muted { margin: 0; color: var(--muted); line-height: 1.55; }
.row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.pill { border: 1px solid var(--border); border-radius: 999px; padding: 6px 10px; font-weight: 900; font-size: 12px; color: var(--muted); }
</style>