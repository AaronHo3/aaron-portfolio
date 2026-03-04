<template>
  <section class="section" v-if="project">
    <div class="head">
      <div>
        <h1 class="title">{{ project.title }}</h1>
        <p class="subtitle">{{ project.subtitle }}</p>
      </div>

      <div class="actions">
        <RouterLink class="btn" to="/projects">← Back</RouterLink>
        <a v-if="project.links.github" class="btn" :href="project.links.github" target="_blank" rel="noreferrer">GitHub</a>
        <a
          v-if="project.links.dashboard || project.links.demo"
          class="btn"
          :href="project.links.dashboard || project.links.demo"
          target="_blank"
          rel="noreferrer"
        >
          View Dashboard
        </a>
        <a v-if="project.links.report" class="btn" :href="project.links.report" target="_blank" rel="noreferrer">Report</a>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2 class="h2">Overview</h2>
        <p class="p">{{ project.summary }}</p>

        <div v-if="project.links.dashboard || project.links.demo" class="externalLink">
          <p class="linkLabel">Live Project Link</p>
          <a
            class="btn"
            :href="project.links.dashboard || project.links.demo"
            target="_blank"
            rel="noreferrer"
          >
            Open Dashboard
          </a>
        </div>

        <ul class="list">
          <li v-for="b in project.bullets" :key="b">{{ b }}</li>
        </ul>
      </div>

      <div class="card">
        <h2 class="h2">Tech Categories</h2>
        <div class="pillRow">
          <span v-for="t in project.modelTypes || []" :key="t" class="pill">{{ t }}</span>
        </div>

        <h2 class="h2" style="margin-top: 16px;">Languages</h2>
        <div class="pillRow">
          <span v-for="l in project.languages || []" :key="l" class="pill">{{ l }}</span>
        </div>

        <h2 class="h2" style="margin-top: 16px;">Tools</h2>
        <div class="pillRow">
          <span v-for="s in project.stack" :key="s" class="pill">{{ s }}</span>
        </div>

        <h2 class="h2" style="margin-top: 16px;">Metrics</h2>
        <div class="pillRow">
          <span v-for="m in project.metrics" :key="m" class="pill">{{ m }}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section" v-else>
    <div class="card">
      <h2 class="h2">Project not found</h2>
      <RouterLink class="btn" to="/projects">Back to Projects</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { projects } from "../data/projects";

const route = useRoute();

const project = computed(() => {
  const slug = route.params.slug;
  return projects.find((p) => p.slug === slug);
});
</script>

<style scoped>
.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: clamp(26px, 3.2vw, 40px);
  letter-spacing: -0.03em;
}

.subtitle {
  margin: 10px 0 0;
  color: var(--muted);
  line-height: 1.55;
  max-width: 760px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 14px;
  margin-top: 16px;
}

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}

.h2 {
  margin: 0 0 10px;
  letter-spacing: -0.02em;
  font-size: 16px;
}

.p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.list {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.65;
}

.externalLink {
  margin-top: 14px;
}

.linkLabel {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--muted);
  font-weight: 800;
}

.pillRow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 6px 10px;
  font-weight: 850;
  font-size: 12px;
  color: var(--muted);
}
</style>
