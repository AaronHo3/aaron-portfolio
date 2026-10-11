<template>
  <article v-if="project" class="container page caseStudy">
    <!-- 1. Back link and category -->
    <p class="crumbs">
      <RouterLink class="backLink" to="/projects">← All projects</RouterLink>
      <span v-if="category" class="eyebrow crumbCategory">{{ category }}</span>
    </p>

    <header class="csHeader">
      <!-- 2. Title and subtitle -->
      <h1 class="csTitle">{{ displayTitle }}</h1>
      <p v-if="titleRemainder" class="fullTitle">{{ titleRemainder }}</p>

      <!-- 3. Question-led introduction, with the project's status kept beside it -->
      <p class="lead csLead">{{ project.intro || project.subtitle }}</p>
      <p v-if="project.status" class="statusNote"><strong>Status:</strong> {{ project.status }}</p>

      <!-- 4. Primary links -->
      <div v-if="links.length" class="csLinks">
        <a
          v-for="(link, i) in links"
          :key="link.href"
          class="btn"
          :class="{ 'btn-primary': i === 0 }"
          :href="link.href"
          target="_blank"
          rel="noopener"
        >
          {{ link.label }}<span class="visually-hidden"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>

    <!-- 5. Main takeaway -->
    <section v-if="project.headlineStats?.length" class="glance" aria-labelledby="glance-title">
      <h2 id="glance-title" class="eyebrow glanceTitle">At a glance</h2>
      <dl class="glanceList">
        <div v-for="s in project.headlineStats" :key="s.label" class="glanceItem">
          <dt class="glanceValue">{{ s.value }}</dt>
          <dd class="glanceLabel">{{ s.label }}</dd>
        </div>
      </dl>
    </section>

    <!-- 6. Overview figure (only when a real one exists) -->
    <figure v-if="project.image" class="csFigure">
      <img
        :src="project.image"
        :alt="figureAlt"
        :width="imageSize[0]"
        :height="imageSize[1]"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <span v-if="project.imageCaption">{{ project.imageCaption }}</span>
        <a :href="project.image" target="_blank" rel="noopener" class="figureLink">
          Open full-size figure<span class="visually-hidden"> (opens in a new tab)</span> ↗
        </a>
      </figcaption>
    </figure>

    <!-- 7. Compact supporting metadata -->
    <dl v-if="project.context || builtWith" class="metaStrip">
      <div v-if="project.context">
        <dt>Context</dt>
        <dd>{{ project.context }}</dd>
      </div>
      <div v-if="builtWith">
        <dt>Built with</dt>
        <dd>{{ builtWith }}</dd>
      </div>
    </dl>

    <div class="csBody" :class="{ withToc: showToc }">
      <nav v-if="showToc" class="toc" aria-label="Sections">
        <p class="tocTitle">On this page</p>
        <ol>
          <li v-for="s in sections" :key="s.id">
            <RouterLink :to="{ hash: `#${s.id}` }">{{ s.label }}</RouterLink>
          </li>
        </ol>
      </nav>

      <div class="csProse">
        <template v-if="cs">
          <!-- 5. Question -->
          <section v-if="cs.problem" id="question" aria-labelledby="question-title">
            <h2 id="question-title">The question</h2>
            <p v-for="(para, i) in asParagraphs(cs.problem)" :key="i">{{ para }}</p>
          </section>

          <!-- 6. Approach and contribution -->
          <section v-if="cs.approach" id="approach" aria-labelledby="approach-title">
            <h2 id="approach-title">Approach</h2>
            <p v-for="(para, i) in asParagraphs(cs.approach)" :key="i">{{ para }}</p>

            <div v-if="project.channels?.length" class="channels">
              <div v-for="c in project.channels" :key="c.name" class="channel">
                <h3>{{ c.name }}</h3>
                <p>{{ c.text }}</p>
              </div>
            </div>

            <template v-if="cs.architecture?.length">
              <h3>How it works</h3>
              <ol class="steps">
                <li v-for="(step, i) in cs.architecture" :key="i">{{ step }}</li>
              </ol>
            </template>
          </section>

          <!-- 7. Findings -->
          <section v-if="cs.findings?.length" id="findings" aria-labelledby="findings-title">
            <h2 id="findings-title">Findings</h2>
            <div v-for="(f, i) in normalizedFindings" :key="i" class="finding">
              <h3 v-if="f.title">{{ f.title }}</h3>
              <p>{{ f.text }}</p>
            </div>
          </section>

          <section v-if="cs.results?.length" id="results" aria-labelledby="results-title">
            <h2 id="results-title">{{ cs.findings?.length ? "Supporting results" : "Results" }}</h2>
            <div class="tableWrap" tabindex="0" role="region" aria-labelledby="results-title">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Measure</th>
                    <th scope="col">Value</th>
                    <th scope="col">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in cs.results" :key="r.metric">
                    <th scope="row">{{ r.metric }}</th>
                    <td class="valueCell">{{ r.value }}</td>
                    <td>{{ r.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 8. Limitations -->
          <section v-if="cs.limitations?.length" id="limitations" aria-labelledby="limitations-title">
            <h2 id="limitations-title">Limitations</h2>
            <ul class="bullets">
              <li v-for="l in cs.limitations" :key="l">{{ l }}</li>
            </ul>
          </section>

          <!-- 9. Next steps -->
          <section v-if="cs.future?.length" id="next-steps" aria-labelledby="next-title">
            <h2 id="next-title">Next steps</h2>
            <ul class="bullets">
              <li v-for="f in cs.future" :key="f">{{ f }}</li>
            </ul>
          </section>
        </template>

        <!-- Projects without a case study yet -->
        <section v-else id="overview" aria-labelledby="overview-title">
          <h2 id="overview-title">Overview</h2>
          <p>{{ project.summary }}</p>
          <ul v-if="project.bullets?.length" class="bullets">
            <li v-for="b in project.bullets" :key="b">{{ b }}</li>
          </ul>
        </section>
      </div>
    </div>

    <!-- 10. Related projects -->
    <section v-if="related.length" class="section related" aria-labelledby="related-title">
      <div class="section-head">
        <h2 id="related-title">More projects</h2>
        <RouterLink class="text-link" to="/projects">All projects <span class="arrow" aria-hidden="true">→</span></RouterLink>
      </div>
      <ul class="relatedGrid">
        <li v-for="p in related" :key="p.slug">
          <ProjectCard :project="p" :heading-level="3" />
        </li>
      </ul>
    </section>
  </article>

  <div v-else class="container page">
    <h1 class="page-title">Project not found</h1>
    <p class="lead notFoundLead">This project may have moved or been unpublished.</p>
    <RouterLink class="btn" to="/projects">Browse all projects</RouterLink>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import ProjectCard from "../components/ProjectCard.vue";
import { projects } from "../data/projects";
import { absoluteUrl } from "../lib/content/urls.js";
import { usePageHead } from "../lib/head.js";

/** Show the section menu once a write-up has at least this many sections. */
const TOC_MIN_SECTIONS = 5;
const RELATED_COUNT = 2;

const route = useRoute();

const project = computed(() => projects.find((p) => p.slug === route.params.slug && !p.hidden));
const cs = computed(() => project.value?.caseStudy);
const displayTitle = computed(() => project.value?.displayTitle || project.value?.title);
/** "Neural Decoding | What Actually Limits..." -> "What Actually Limits..." when displayTitle is the prefix. */
const titleRemainder = computed(() => {
  const p = project.value;
  if (!p?.displayTitle || p.displayTitle === p.title) return "";
  const prefix = `${p.displayTitle} | `;
  return p.title.startsWith(prefix) ? p.title.slice(prefix.length) : p.title;
});
/** Languages then tools, de-duplicated case-insensitively (e.g. Python listed once). */
const builtWith = computed(() => {
  const seen = new Set();
  return [...(project.value?.languages ?? []), ...(project.value?.stack ?? [])]
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
});
const category = computed(() => project.value?.modelTypes?.[0] ?? "");
const imageSize = computed(() => project.value?.imageSize ?? [1600, 900]);
// Short alt text; the full description is in the visible figcaption, so it is not repeated here.
const figureAlt = computed(() => `${displayTitle.value} overview diagram`);

/** Problem/approach may be one string or an array of paragraphs. */
const asParagraphs = (value) => (Array.isArray(value) ? value : [value]);

const normalizedFindings = computed(() =>
  (cs.value?.findings ?? []).map((f) => (typeof f === "string" ? { title: "", text: f } : f)),
);

const links = computed(() => {
  const l = project.value?.links ?? {};
  return [
    l.github && { label: "Code on GitHub", href: l.github },
    l.report && { label: "Full report", href: l.report },
    (l.demo || l.dashboard) && { label: "Live demo", href: l.demo || l.dashboard },
  ].filter(Boolean);
});

const sections = computed(() => {
  const c = cs.value;
  if (!c) return [];
  return [
    c.problem && { id: "question", label: "The question" },
    c.approach && { id: "approach", label: "Approach" },
    c.findings?.length && { id: "findings", label: "Findings" },
    c.results?.length && { id: "results", label: c.findings?.length ? "Supporting results" : "Results" },
    c.limitations?.length && { id: "limitations", label: "Limitations" },
    c.future?.length && { id: "next-steps", label: "Next steps" },
  ].filter(Boolean);
});

const showToc = computed(() => sections.value.length >= TOC_MIN_SECTIONS);

const related = computed(() => {
  if (!project.value) return [];
  const others = projects.filter((p) => !p.hidden && p.slug !== project.value.slug);
  const sameCategory = others.filter((p) => p.modelTypes?.[0] === category.value);
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, RELATED_COUNT);
});

usePageHead(() =>
  project.value
    ? {
        title: `${displayTitle.value} | Aaron Ho`,
        description: project.value.cardSummary || project.value.subtitle,
        canonical: absoluteUrl(`/projects/${project.value.slug}`),
      }
    : { title: "Project not found | Aaron Ho", noindex: true },
);
</script>

<style scoped>
.backLink {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: var(--fs-small);
  font-weight: 600;
  text-decoration: none;
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-5);
  margin: 0;
}

.crumbCategory {
  font-size: var(--fs-meta);
}

.csHeader {
  max-width: 820px;
  margin-top: var(--space-3);
}

.csTitle {
  font-size: var(--fs-hero);
  line-height: 1.05;
}

.fullTitle {
  margin-top: var(--space-3);
  color: var(--color-text-muted);
  font-weight: 600;
}

.csLead {
  margin-top: var(--space-5);
}

.statusNote {
  margin-top: var(--space-4);
  padding-left: var(--space-3);
  border-left: 3px solid var(--color-control-border);
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--color-text-muted);
}

.statusNote strong {
  color: var(--color-text);
}

.csLinks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

/* Compact metadata strip after the figure */
.metaStrip {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: var(--space-3) var(--space-6);
  margin: var(--space-6) 0 0;
  padding: var(--space-4) 0;
  border-top: var(--border);
  border-bottom: var(--border);
  font-size: var(--fs-meta);
  line-height: 1.55;
}

.metaStrip dt {
  font-weight: 700;
  color: var(--color-text-muted);
}

.metaStrip dd {
  margin: 2px 0 0;
}

/* At a glance */
.glance {
  margin-top: var(--space-6);
  padding: var(--space-5) var(--space-6);
  background: var(--color-surface);
  border: var(--border);
  border-radius: var(--radius-lg);
}

.glanceTitle {
  font-size: var(--fs-meta);
  margin-bottom: var(--space-4);
}

.glanceList {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-5) var(--space-6);
  margin: 0;
}

.glanceValue {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 1.3rem + 0.8vw, 2rem);
  font-weight: 600;
  line-height: 1.15;
  color: var(--color-accent);
}

.glanceLabel {
  margin: var(--space-2) 0 0;
  font-size: var(--fs-small);
  line-height: 1.5;
  color: var(--color-text-muted);
}

/* Figure */
.csFigure {
  margin: var(--space-6) 0 0;
}

.csFigure img {
  display: block;
  width: 100%;
  height: auto;
  border: var(--border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.csFigure figcaption {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  justify-content: space-between;
  max-width: var(--w-prose);
  margin-top: var(--space-3);
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  line-height: 1.55;
}

.figureLink {
  font-weight: 600;
  white-space: nowrap;
}

/* Body with section menu */
.csBody {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-7);
  margin-top: var(--space-7);
}

.csBody.withToc {
  grid-template-columns: 200px minmax(0, 1fr);
}

.toc {
  position: sticky;
  top: calc(var(--header-h) + var(--space-5));
  align-self: start;
}

.tocTitle {
  margin-bottom: var(--space-3);
  font-size: var(--fs-meta);
  font-weight: 700;
  color: var(--color-text-muted);
}

.toc ol {
  display: grid;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: var(--border);
}

.toc a {
  display: block;
  padding: var(--space-1) var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--fs-small);
  text-decoration: none;
}

.toc a:hover {
  color: var(--color-accent);
}

.csProse {
  max-width: var(--w-prose);
}

.csProse section + section {
  margin-top: var(--space-7);
}

.csProse h2 {
  margin-bottom: var(--space-4);
}

.csProse h3 {
  margin: var(--space-5) 0 var(--space-2);
  font-size: 1.1875rem;
}

.csProse p + p {
  margin-top: var(--space-4);
}

.finding + .finding {
  margin-top: var(--space-5);
}

.channels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-5);
}

.channel {
  padding: var(--space-4) var(--space-5);
  border: var(--border);
  border-top: 3px solid var(--color-accent);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.channel h3 {
  margin-top: 0;
}

.channel p {
  font-size: var(--fs-small);
  line-height: 1.6;
}

.steps,
.bullets {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-3) 0 0;
  padding-left: 1.4em;
}

.steps li::marker {
  font-weight: 700;
  color: var(--color-accent);
}

.bullets li::marker {
  color: var(--color-accent);
}

/* Results table */
.tableWrap {
  overflow-x: auto;
  border: var(--border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: var(--fs-small);
  line-height: 1.5;
}

th,
td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  vertical-align: top;
  border-bottom: var(--border);
}

thead th {
  font-size: var(--fs-meta);
  color: var(--color-text-muted);
  background: var(--color-surface-muted);
}

tbody tr:last-child > * {
  border-bottom: 0;
}

tbody th {
  font-weight: 650;
}

.valueCell {
  font-weight: 700;
  color: var(--color-accent);
  white-space: nowrap;
}

/* Related */
.relatedGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.notFoundLead {
  margin: var(--space-4) 0 var(--space-5);
}

@media (max-width: 1000px) {
  .csBody.withToc {
    grid-template-columns: minmax(0, 1fr);
  }
  .toc {
    position: static;
  }
  .toc ol {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-2);
    border-left: 0;
  }
  .toc a {
    padding: var(--space-1) var(--space-2);
    border: var(--border);
    border-radius: var(--radius-sm);
  }
}

@media (max-width: 760px) {
  .glanceList,
  .metaStrip,
  .channels,
  .relatedGrid {
    grid-template-columns: 1fr;
  }
  .glance {
    padding: var(--space-5);
  }
}
</style>
