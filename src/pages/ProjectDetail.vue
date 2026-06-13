<template>
  <section class="section" v-if="project">
    <!-- HEADER -->
    <div class="head">
      <div>
        <RouterLink class="backLink" to="/projects">← All projects</RouterLink>
        <h1 class="title">{{ project.title }}</h1>
        <p class="subtitle">{{ project.subtitle }}</p>
        <div class="tagRow">
          <span v-for="t in project.tags || []" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>

      <div class="actions">
        <a v-if="project.links.github" class="btn" :href="project.links.github" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a
          v-if="liveLink"
          class="btn primary"
          :href="liveLink"
          target="_blank"
          rel="noreferrer"
        >
          {{ liveLabel }} ↗
        </a>
        <a v-if="project.links.report" class="btn" :href="project.links.report" target="_blank" rel="noreferrer">Report ↗</a>
      </div>
    </div>

    <!-- HEADLINE STATS -->
    <div v-if="project.headlineStats?.length" class="statRow">
      <div v-for="s in project.headlineStats" :key="s.label" class="statCard">
        <p class="statValue">{{ s.value }}</p>
        <p class="statLabel">{{ s.label }}</p>
      </div>
    </div>

    <!-- BODY -->
    <div class="grid">
      <!-- MAIN NARRATIVE -->
      <div class="main">
        <!-- Case-study layout -->
        <template v-if="cs">
          <article class="card block">
            <h2 class="h2">The problem</h2>
            <p class="p">{{ cs.problem }}</p>
          </article>

          <article class="card block">
            <h2 class="h2">Approach</h2>
            <p class="p">{{ cs.approach }}</p>
          </article>

          <article v-if="cs.architecture?.length" class="card block">
            <h2 class="h2">How it works</h2>
            <ol class="steps">
              <li v-for="(step, i) in cs.architecture" :key="i" class="step">
                <span class="stepNum">{{ i + 1 }}</span>
                <span class="stepText">{{ step }}</span>
              </li>
            </ol>
          </article>

          <article v-if="cs.findings?.length" class="card block">
            <h2 class="h2">Key findings</h2>
            <ul class="list">
              <li v-for="f in cs.findings" :key="f">{{ f }}</li>
            </ul>
          </article>

          <article v-if="cs.results?.length" class="card block">
            <h2 class="h2">Results</h2>
            <div class="resultTable">
              <div v-for="r in cs.results" :key="r.metric" class="resultRow">
                <span class="resultMetric">{{ r.metric }}</span>
                <span class="resultValue">{{ r.value }}</span>
                <span class="resultNote">{{ r.note }}</span>
              </div>
            </div>
          </article>

          <div class="twoUp">
            <article v-if="cs.limitations?.length" class="card block">
              <h2 class="h2">Limitations</h2>
              <ul class="list">
                <li v-for="l in cs.limitations" :key="l">{{ l }}</li>
              </ul>
            </article>

            <article v-if="cs.future?.length" class="card block">
              <h2 class="h2">What's next</h2>
              <ul class="list">
                <li v-for="f in cs.future" :key="f">{{ f }}</li>
              </ul>
            </article>
          </div>
        </template>

        <!-- Fallback layout (projects without a case study yet) -->
        <template v-else>
          <article class="card block">
            <h2 class="h2">Overview</h2>
            <p class="p">{{ project.summary }}</p>
            <ul class="list" v-if="project.bullets?.length">
              <li v-for="b in project.bullets" :key="b">{{ b }}</li>
            </ul>
          </article>
        </template>
      </div>

      <!-- META SIDEBAR -->
      <aside class="side">
        <div class="card metaCard">
          <div v-if="liveLink" class="metaLinks">
            <a class="btn primary full" :href="liveLink" target="_blank" rel="noreferrer">{{ liveLabel }} ↗</a>
          </div>
          <a v-if="project.links.github" class="btn full" :href="project.links.github" target="_blank" rel="noreferrer">View code on GitHub ↗</a>

          <div v-if="project.modelTypes?.length" class="metaGroup">
            <h3 class="metaHead">Focus areas</h3>
            <div class="pillRow">
              <span v-for="t in project.modelTypes" :key="t" class="pill">{{ t }}</span>
            </div>
          </div>

          <div v-if="project.languages?.length" class="metaGroup">
            <h3 class="metaHead">Languages</h3>
            <div class="pillRow">
              <span v-for="l in project.languages" :key="l" class="pill">{{ l }}</span>
            </div>
          </div>

          <div v-if="project.stack?.length" class="metaGroup">
            <h3 class="metaHead">Tools</h3>
            <div class="pillRow">
              <span v-for="s in project.stack" :key="s" class="pill">{{ s }}</span>
            </div>
          </div>

          <div v-if="!cs && project.metrics?.length" class="metaGroup">
            <h3 class="metaHead">Metrics</h3>
            <div class="pillRow">
              <span v-for="m in project.metrics" :key="m" class="pill">{{ m }}</span>
            </div>
          </div>
        </div>
      </aside>
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

const cs = computed(() => project.value?.caseStudy);

const liveLink = computed(() => {
  const l = project.value?.links || {};
  return l.dashboard || l.demo || "";
});

const liveLabel = computed(() =>
  project.value?.links?.dashboard ? "Open live dashboard" : "Open live demo"
);
</script>

<style scoped>
/* ---- HEADER ---- */
.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}

.backLink {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--muted);
  font-weight: 850;
  font-size: 13px;
  text-decoration: none;
  transition: color 160ms ease;
}
.backLink:hover {
  color: var(--accent);
}

.title {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 44px);
  letter-spacing: -0.03em;
  line-height: 1.08;
  max-width: 20ch;
}

.subtitle {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.55;
  max-width: 720px;
}

.tagRow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.tag {
  border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
  border-radius: var(--r-pill);
  padding: 5px 12px;
  font-weight: 850;
  font-size: 12px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent-soft) 40%, transparent);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ---- HEADLINE STATS ---- */
.statRow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 28px;
}
.statCard {
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 18px 20px;
  background: color-mix(in srgb, var(--card) 80%, transparent);
  position: relative;
  overflow: hidden;
}
.statCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  opacity: 0.8;
}
.statValue {
  margin: 0;
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}
.statLabel {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

/* ---- BODY GRID ---- */
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 28px;
  align-items: start;
}
@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}

.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.block { padding: var(--space-4); }

.twoUp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 620px) {
  .twoUp { grid-template-columns: 1fr; }
}

.side {
  position: sticky;
  top: 20px;
}
@media (max-width: 900px) {
  .side { position: static; }
}

/* ---- TYPOGRAPHY ---- */
.h2 {
  margin: 0 0 12px;
  letter-spacing: -0.02em;
  font-size: 20px;
}
.p {
  margin: 0;
  color: var(--text);
  opacity: 0.92;
  line-height: 1.7;
}
.list {
  margin: 0;
  padding-left: 20px;
  color: var(--muted);
  line-height: 1.7;
}
.list li { margin-bottom: 8px; }
.list li:last-child { margin-bottom: 0; }

/* ---- NUMBERED STEPS ---- */
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.step {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.stepNum {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  font-family: "Fraunces", Georgia, serif;
  font-weight: 800;
  font-size: 14px;
  color: color-mix(in srgb, #0f172a 80%, white);
  background: linear-gradient(140deg, var(--accent), var(--accent-2));
}
.stepText {
  color: var(--muted);
  line-height: 1.6;
  padding-top: 3px;
}

/* ---- RESULTS TABLE ---- */
.resultTable {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.resultRow {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "metric value" "note note";
  gap: 2px 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}
.resultRow:last-child { border-bottom: none; }
.resultRow:nth-child(odd) {
  background: color-mix(in srgb, var(--accent-soft) 14%, transparent);
}
.resultMetric {
  grid-area: metric;
  font-weight: 800;
  color: var(--text);
  font-size: 14px;
}
.resultValue {
  grid-area: value;
  font-family: "Fraunces", Georgia, serif;
  font-weight: 800;
  font-size: 16px;
  color: var(--accent);
  white-space: nowrap;
}
.resultNote {
  grid-area: note;
  color: var(--muted);
  font-size: 13px;
}

/* ---- META SIDEBAR ---- */
.metaCard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.metaLinks { display: flex; }
.full { width: 100%; justify-content: center; }
.metaGroup { display: flex; flex-direction: column; gap: 10px; }
.metaHead {
  margin: 0;
  font-family: "Figtree", system-ui, sans-serif;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 900;
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
