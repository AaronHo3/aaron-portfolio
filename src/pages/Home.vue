<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="left">
        <h1 class="title" :class="{ in: mounted }">
          I’m <span class="accent">Aaron</span> — at <span class="accent">Sanofi</span>, I build AI-driven bioreactor
          digital twin simulations.
        </h1>

        <p class="sub" :class="{ in: mounted }">
          I build projects in EEG classification, CT imaging, neural decoding, and digital twins. I focus on clear, explainable models and practical dashboards.
        </p>

        <div ref="trustRowRef" class="trustRow" :class="{ in: mounted }">
          <div v-for="(s, i) in animatedStats" :key="s.label" class="trustStat" :style="{ '--sd': `${i * 70}ms` }">
            <strong>{{ s.value }}{{ s.suffix }}</strong>
            <span>{{ s.label }}</span>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="heroOrb" aria-hidden="true">
          <HeroOrb3D />
        </div>

        <!-- Tilt wrapper -->
        <div
          class="tilt"
          @mousemove="onMove"
          @mouseleave="onLeave"
          :style="tiltStyle"
          :class="{ in: mounted }"
        >
          <div class="aura" aria-hidden="true"></div>
          <div class="orbit o1" aria-hidden="true"><span class="orb"></span></div>
          <div class="orbit o2" aria-hidden="true"><span class="orb"></span></div>
          <img class="pfp" :src="profileSrc" alt="Portrait of Aaron Ho" />
        </div>

      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="section breakSection">
      <div class="featuredHead">
        <h2 class="sectionTitle">Featured Projects</h2>
        <RouterLink class="btn allProjectsBtn" to="/projects">All projects →</RouterLink>
      </div>

      <div class="grid">
        <RouterLink
          v-for="(p, i) in featured"
          :key="p.slug"
          class="card featuredCard"
          :class="[{ in: mounted }, `d${i}`]"
          :to="`/projects/${p.slug}`"
          :style="{ '--tone': projectTone(p) }"
          @mousemove="onCardMove($event, p.slug)"
          @mouseleave="onCardLeave(p.slug)"
        >
          <div class="visual" :style="visualStyle(p.slug)">
            <div class="visualInner" aria-hidden="true">
              <component :is="projectIcon(p.slug)" class="visualIcon" />
              <div class="miniBars">
                <span :style="{ width: miniBarWidths(p.slug)[0] }"></span>
                <span :style="{ width: miniBarWidths(p.slug)[1] }"></span>
                <span :style="{ width: miniBarWidths(p.slug)[2] }"></span>
              </div>
            </div>
            <p class="visualLabel">{{ projectVisualLabel(p.slug) }}</p>
          </div>

          <div class="cardTop">
            <h3 class="cardTitle">{{ p.title }}</h3>
            <span class="hint">View</span>
          </div>

          <p class="cardSub">{{ p.subtitle }}</p>

          <div class="tags">
            <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
          </div>
        </RouterLink>
      </div>

    </section>

    <section class="section educationSection breakSection">
      <div class="featuredHead">
        <h2 class="sectionTitle">Education</h2>
      </div>

      <div class="eduGrid">
        <article class="card eduCard">
          <p class="eduType">Graduate Degree</p>
          <h3>University of Southern California</h3>
          <p class="eduDegree">M.S. Biomedical Data Analytics</p>
          <p class="eduMeta">Focus: AI-driven biomedical modeling and decision analytics</p>
        </article>

        <article class="card eduCard">
          <p class="eduType">Bootcamp</p>
          <h3>Fullstack Academy</h3>
          <p class="eduDegree">Artificial Intelligence &amp; Machine Learning Bootcamp</p>
          <p class="eduMeta">Applied ML workflows, model evaluation, and production-minded AI implementation</p>
        </article>

        <article class="card eduCard">
          <p class="eduType">Undergraduate Degree</p>
          <h3>Boston University</h3>
          <p class="eduDegree">B.A. Biochemistry &amp; Molecular Biology</p>
          <p class="eduMeta">Graduated with honors; completed and defended an undergraduate thesis.</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Activity, BrainCircuit, ChartScatter, Dribbble, ScanSearch, Volleyball } from "lucide-vue-next";
import profileSrc from "../assets/profile.jpg";
import { projects } from "../data/projects";
import HeroOrb3D from "../components/HeroOrb3D.vue";

const mounted = ref(false);
const trustRowRef = ref(null);
const animatedStats = ref([]);
const visualTilt = ref({});
let statsObserver;

/* choose featured projects (first 3 for now) */
const featured = computed(() => projects.slice(0, 3));
const uniqueStackCount = computed(() => {
  const stack = new Set();
  for (const p of projects) for (const s of p.stack || []) stack.add(s);
  return stack.size;
});
const domainCount = computed(() => {
  const domains = new Set(projects.map((p) => p.tags?.[0]).filter(Boolean));
  return domains.size;
});
const statTargets = computed(() => ([
  { label: "Projects built", value: projects.length, suffix: "+" },
  { label: "Tools in stack", value: uniqueStackCount.value, suffix: "+" },
  { label: "Domains explored", value: domainCount.value, suffix: "" },
]));

/* tilt state */
const rx = ref(0);
const ry = ref(0);

const tiltStyle = computed(() => ({
  transform: `perspective(900px) rotateX(${rx.value}deg) rotateY(${ry.value}deg) translateY(${mounted.value ? 0 : 10}px) scale(${mounted.value ? 1 : 0.98})`,
}));

onMounted(() => {
  animatedStats.value = statTargets.value.map((s) => ({ ...s, value: 0 }));
  requestAnimationFrame(() => {
    mounted.value = true;
  });
  setupStatObserver();
});

onBeforeUnmount(() => {
  statsObserver?.disconnect();
});

function onMove(e) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;

  const max = 8;
  ry.value = (px - 0.5) * (max * 2);
  rx.value = (0.5 - py) * (max * 2);
}

function onLeave() {
  rx.value = 0;
  ry.value = 0;
}

function animateValue(from, to, onUpdate, duration = 900) {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const next = Math.round(from + (to - from) * eased);
    onUpdate(next);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function runStatAnimation() {
  animatedStats.value = statTargets.value.map((s) => ({ ...s, value: 0 }));
  for (let i = 0; i < statTargets.value.length; i += 1) {
    const target = statTargets.value[i];
    animateValue(0, target.value, (n) => {
      animatedStats.value[i] = { ...target, value: n };
    }, 860 + i * 80);
  }
}

function setupStatObserver() {
  if (!trustRowRef.value) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    animatedStats.value = statTargets.value.map((s) => ({ ...s }));
    return;
  }

  statsObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      runStatAnimation();
      statsObserver?.disconnect();
    },
    { threshold: 0.35 },
  );

  statsObserver.observe(trustRowRef.value);
}

const iconBySlug = {
  "eeg-seizure-classification": BrainCircuit,
  "luna16-nodule-segmentation": ScanSearch,
  "imagined-handwriting-decoding": Activity,
  "gapminder-dashboard": ChartScatter,
  "mens-2023-vnl-dashboard": Volleyball,
  "nba-statistics-dashboard": Dribbble,
};

const labelBySlug = {
  "eeg-seizure-classification": "Signal classification visual",
  "luna16-nodule-segmentation": "CT segmentation visual",
  "imagined-handwriting-decoding": "Neural decoding visual",
  "gapminder-dashboard": "Dashboard interaction visual",
  "mens-2023-vnl-dashboard": "Volleyball analytics visual",
  "nba-statistics-dashboard": "NBA analytics visual",
};

const barsBySlug = {
  "eeg-seizure-classification": ["88%", "72%", "94%"],
  "luna16-nodule-segmentation": ["93%", "84%", "78%"],
  "imagined-handwriting-decoding": ["74%", "90%", "82%"],
  "gapminder-dashboard": ["64%", "86%", "92%"],
  "mens-2023-vnl-dashboard": ["91%", "76%", "87%"],
  "nba-statistics-dashboard": ["89%", "81%", "93%"],
};
const toneByTag = {
  "Healthcare AI": "#3567ac",
  "Medical Imaging": "#267c80",
  Neuroscience: "#6b53ab",
  "Sports Analytics": "#0a7b83",
  "Data Visualization / Dashboards": "#b3472b",
  Miscellaneous: "#7a7f87",
};

function projectIcon(slug) {
  return iconBySlug[slug] || ChartScatter;
}

function projectVisualLabel(slug) {
  return labelBySlug[slug] || "Project visual";
}

function miniBarWidths(slug) {
  return barsBySlug[slug] || ["76%", "70%", "88%"];
}

function projectTone(project) {
  const match = project.tags.find((t) => toneByTag[t]);
  return match ? toneByTag[match] : "var(--accent)";
}

function onCardMove(e, slug) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const r = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  const max = 8;
  visualTilt.value[slug] = {
    x: ((px - 0.5) * max).toFixed(2),
    y: ((py - 0.5) * max).toFixed(2),
  };
}

function onCardLeave(slug) {
  visualTilt.value[slug] = { x: 0, y: 0 };
}

function visualStyle(slug) {
  const t = visualTilt.value[slug] || { x: 0, y: 0 };
  return {
    transform: `perspective(700px) rotateX(${-t.y}deg) rotateY(${t.x}deg)`,
  };
}
</script>

<style scoped>
/* ---- HERO LAYOUT ---- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  margin-top: 10px;
}

.left {
  max-width: 760px;
}

.right {
  display: grid;
  place-items: center;
  position: relative;
  min-height: 320px;
}

.heroOrb {
  position: absolute;
  width: 360px;
  height: 360px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.9;
}

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
  .right {
    order: -1;
    place-items: center;
    justify-self: center;
    width: 100%;
  }
  .heroOrb { display: none; }
}

/* ---- STAGGERED TEXT ENTRANCE ---- */
.title,
.sub,
.trustRow {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(6px);
  transition:
    opacity 520ms ease,
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 520ms ease;
}

.title.in { transition-delay: 100ms; }
.sub.in { transition-delay: 180ms; }
.trustRow.in { transition-delay: 260ms; }

.title.in,
.sub.in,
.trustRow.in {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

h1 {
  margin: 16px 0 10px;
  max-width: 17ch;
  font-size: clamp(34px, 4.4vw, 52px);
  letter-spacing: -0.03em;
  line-height: 1.08;
}

.accent {
  background: linear-gradient(110deg, var(--text), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sub {
  margin: 0;
  max-width: 760px;
  font-size: 18px;
  color: var(--muted);
  line-height: 1.5;
}

.trustRow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.trustStat {
  padding: 10px 12px;
  border-radius: var(--r-md);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--border));
  background: color-mix(in srgb, var(--accent-soft) 46%, var(--card));
  transition: transform 260ms ease, box-shadow 260ms ease;
  transition-delay: var(--sd, 0ms);
}

.trustStat:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px color-mix(in srgb, var(--accent) 16%, transparent);
}

.trustStat strong {
  display: block;
  font-family: "Sora", "Plus Jakarta Sans", system-ui, sans-serif;
  letter-spacing: -0.02em;
  font-size: 13px;
}

.trustStat span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
}

/* ---- PROFILE PICTURE TILT + ENTRANCE ---- */
.tilt {
  position: relative;
  width: 240px;
  height: 240px;
  margin-inline: auto;
  border-radius: 999px;
  z-index: 1;

  opacity: 0;
  filter: blur(6px);

  transform-style: preserve-3d;
  transition:
    opacity 520ms ease,
    filter 520ms ease,
    transform 220ms ease;
}

.tilt.in {
  opacity: 1;
  filter: blur(0);
}

.pfp {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: var(--shadow);
  transform: translateZ(18px);
}

.tilt::after {
  content: "";
  position: absolute;
  inset: -34px;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%);
  z-index: -1;
}

/* ---- Portrait aura + orbit dots ---- */
.aura {
  position: absolute;
  inset: -14px;
  border-radius: 999px;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
  box-shadow:
    0 0 0 10px color-mix(in srgb, var(--accent) 8%, transparent),
    0 0 48px color-mix(in srgb, var(--accent-2) 18%, transparent);
  opacity: 0.85;
  animation: auraPulse 3.8s ease-in-out infinite;
}

.orbit {
  position: absolute;
  inset: -22px;
  border-radius: 999px;
  pointer-events: none;
  animation: orbitSpin 11s linear infinite;
}

.orbit.o2 {
  inset: -30px;
  animation-duration: 14s;
  animation-direction: reverse;
}

.orb {
  position: absolute;
  top: 0;
  left: 50%;
  width: 8px;
  height: 8px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(150deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 38%, transparent);
}

.o2 .orb {
  width: 6px;
  height: 6px;
  opacity: 0.7;
}

@keyframes auraPulse {
  0%, 100% {
    transform: scale(0.985);
    opacity: 0.62;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.92;
  }
}

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ---- FEATURED PROJECTS ---- */
.featuredHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.featuredCard {
  display: block;
  text-decoration: none;
  position: relative;
  isolation: isolate;

  opacity: 0;
  transform: translateY(10px);
  filter: blur(6px);

  transition:
    opacity 520ms ease,
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 520ms ease,
    box-shadow 160ms ease;
}

.featuredCard.in {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* stagger cards */
.featuredCard.d0 { transition-delay: 260ms; }
.featuredCard.d1 { transition-delay: 340ms; }
.featuredCard.d2 { transition-delay: 420ms; }

.featuredCard:hover {
  border-color: color-mix(in srgb, var(--accent) 34%, var(--border));
  box-shadow: 0 16px 30px color-mix(in srgb, var(--accent) 18%, transparent);
  transform: translateY(-4px);
}

.featuredCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 82%, white), color-mix(in srgb, var(--text) 66%, var(--accent)));
  opacity: 0.55;
  transition: opacity 160ms ease;
}

.featuredCard:hover::before {
  opacity: 0.92;
}

.visual {
  margin-bottom: 12px;
  padding: 10px;
  border-radius: var(--r-md);
  border: 1px dashed color-mix(in srgb, var(--accent) 38%, var(--border));
  background: color-mix(in srgb, var(--accent-soft) 54%, transparent);
  transform-style: preserve-3d;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.featuredCard:hover .visual {
  border-color: color-mix(in srgb, var(--accent) 52%, var(--border));
  box-shadow: 0 14px 26px color-mix(in srgb, var(--accent) 14%, transparent);
}

.visualInner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.visualIcon {
  width: 42px;
  height: 42px;
  padding: 9px;
  border-radius: 11px;
  color: color-mix(in srgb, white 90%, var(--bg));
  background: linear-gradient(140deg, var(--tone), color-mix(in srgb, var(--tone) 62%, black));
  transform: translateZ(16px);
}

.miniBars {
  flex: 1;
  display: grid;
  gap: 6px;
}

.miniBars span {
  display: block;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 72%, white), color-mix(in srgb, var(--accent-2) 68%, var(--accent)));
  opacity: 0.9;
}

.visualLabel {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.cardTop {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.cardTitle {
  margin: 0;
  font-size: 16px;
  letter-spacing: -0.01em;
}

.hint {
  color: var(--muted);
  font-weight: 900;
  font-size: 12px;
}

.cardSub {
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
}

.educationSection {
  margin-top: 18px;
}

.allProjectsBtn {
  min-width: 180px;
}

.eduGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.eduCard {
  position: relative;
  overflow: hidden;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.eduCard:hover {
  transform: translateY(-2px) rotate(-0.2deg);
  box-shadow: 0 16px 28px color-mix(in srgb, var(--accent) 16%, transparent);
}

.eduCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  opacity: 0.75;
}

.eduType {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 900;
}

.eduCard h3 {
  margin: 10px 0 6px;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.eduDegree {
  margin: 0;
  font-weight: 800;
}

.eduMeta {
  margin: 6px 0 0;
  color: var(--muted);
  line-height: 1.55;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .title, .sub, .trustRow, .tilt, .featuredCard {
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
  .aura, .orbit, .orb { animation: none !important; filter: none !important; }
  .pfp { transform: none !important; }
  .visual { transform: none !important; }
}

@media (max-width: 760px) {
  .hero {
    justify-items: center;
  }

  .right {
    justify-items: center;
  }

  .trustRow {
    grid-template-columns: 1fr;
  }

  .allProjectsBtn {
    width: 100%;
    justify-content: center;
  }

  .eduGrid {
    grid-template-columns: 1fr;
  }
}
</style>
