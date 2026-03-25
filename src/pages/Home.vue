<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="left">
        <h1 class="title" :class="{ in: mounted }">
          I'm
          <TextShimmer
            as="span"
            class="shimmerAccent"
            :duration="1.8"
            :spread="2"
            text="Aaron"
          >Aaron</TextShimmer>
          — Building
          <TextShimmer
            as="span"
            class="shimmerAccent"
            :duration="2.2"
            :spread="2"
            text="AI"
          >AI</TextShimmer>
          for
          <TextShimmer
            as="span"
            class="shimmerAccent"
            :duration="2"
            :spread="2"
            text="Healthcare"
          >Healthcare</TextShimmer>
        </h1>
        <p class="sub" :class="{ in: mounted }">
          Currently working at Sanofi on AI-driven bioreactor digital twins while building
          <span class="cyclingWrap">
            <Transition name="wordCycle" mode="out-in">
              <span class="cyclingWord" :key="currentWord">{{ currentWord }}</span>
            </Transition>
          </span>
          projects using biomedical data.
        </p>
      </div>

      <div class="right">
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
        <component
          :is="featuredCardComponent(p)"
          v-for="(p, i) in featured"
          :key="p.slug"
          class="card featuredCard"
          :class="[{ in: mounted }, `d${i}`, { locked: p.underConstruction }]"
          v-bind="featuredCardProps(p)"
          :style="{ '--tone': projectTone(p) }"
          @mousemove="onFeaturedMove($event, p)"
          @mouseleave="onFeaturedLeave(p)"
        >
          <div class="visual" :style="visualStyle(p.slug)">
            <div class="visualInner">
              <component :is="projectIcon(p.slug)" class="visualIcon" />
              <div class="visualCopy">
                <p class="visualLabel">{{ projectVisualLabel(p.slug) }}</p>
                <p class="visualMeta">{{ p.tags?.[0] || "Project" }}</p>
              </div>
            </div>
          </div>
          <div class="cardTop">
            <h3 class="cardTitle">{{ p.title }}</h3>
            <span class="hint">{{ p.underConstruction ? "Soon" : "View" }}</span>
          </div>
          <p class="cardSub">{{ p.subtitle }}</p>
          <p v-if="p.underConstruction" class="underNote">Hard-hat zone: under construction</p>
          <div class="tags">
            <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
          </div>
        </component>
      </div>
    </section>

    <!-- EDUCATION -->
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
          <p class="eduMeta">
            Applied ML workflows, model evaluation, and production-minded AI implementation
          </p>
        </article>
        <article class="card eduCard">
          <p class="eduType">Undergraduate Degree</p>
          <h3>Boston University</h3>
          <p class="eduDegree">B.A. Biochemistry &amp; Molecular Biology</p>
          <p class="eduMeta">
            Graduated with honors; completed and defended an undergraduate thesis.
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  Activity,
  BrainCircuit,
  ChartScatter,
  Dribbble,
  FlaskConical,
  Heart,
  ScanSearch,
  Volleyball,
} from "lucide-vue-next";
import { RouterLink } from "vue-router";
import profileSrc from "../assets/profile.jpg";
import { projects } from "../data/projects";
import TextShimmer from "../components/TextShimmer.vue";


const mounted = ref(false);
const visualTilt = ref({});

/* ---- Animated cycling words ---- */
const cyclingWords = ["machine learning", "deep learning", "neural network", "computer vision", "NLP"];
const wordIndex = ref(0);
const currentWord = computed(() => cyclingWords[wordIndex.value]);
let wordTimer;

/* featured project order */
const featuredSlugs = [
  "gutsense-crc-screening",
  "uci-heart-disease-ml",
  "chest-cancer-efficientnet-deit-smallvit",
];

const featured = computed(() =>
  featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter(Boolean)
);

/* tilt state */
const rx = ref(0);
const ry = ref(0);
const tiltStyle = computed(() => ({
  transform: `perspective(900px) rotateX(${rx.value}deg) rotateY(${ry.value}deg) translateY(${
    mounted.value ? 0 : 10
  }px) scale(${mounted.value ? 1 : 0.98})`,
}));

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true;
  });

  wordTimer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % cyclingWords.length;
  }, 2200);
});

onBeforeUnmount(() => {
  if (wordTimer) clearInterval(wordTimer);
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

const iconBySlug = {
  "gutsense-crc-screening":                  FlaskConical,
  "eeg-seizure-classification":              BrainCircuit,
  "luna16-nodule-segmentation":              ScanSearch,
  "chest-cancer-efficientnet-deit-smallvit": ScanSearch,
  "imagined-handwriting-decoding":           Activity,
  "gapminder-dashboard":                     ChartScatter,
  "mens-2023-vnl-dashboard":                 Volleyball,
  "nba-statistics-dashboard":                Dribbble,
  "uci-heart-disease-ml":                    Heart,
};

const labelBySlug = {
  "gutsense-crc-screening":                  "CRC screening platform",
  "eeg-seizure-classification":              "EEG ML pipeline",
  "luna16-nodule-segmentation":              "CT segmentation model",
  "chest-cancer-efficientnet-deit-smallvit": "Chest imaging models",
  "imagined-handwriting-decoding":           "Neural decoding models",
  "gapminder-dashboard":                     "Interactive global trends",
  "mens-2023-vnl-dashboard":                 "Volleyball analytics hub",
  "nba-statistics-dashboard":                "NBA stats dashboard",
  "uci-heart-disease-ml":                    "Cardiac risk modeling",
};

const toneByTag = {
  "Healthcare AI":                   "#38bdf8",
  "Medical Imaging":                 "#6366f1",
  Neuroscience:                      "#818cf8",
  "Sports Analytics":                "#0ea5e9",
  "Data Visualization / Dashboards": "#22d3ee",
  Hackathon:                         "#10b981",
  Miscellaneous:                     "#64748b",
};

function projectIcon(slug) {
  return iconBySlug[slug] || ChartScatter;
}

function projectVisualLabel(slug) {
  return labelBySlug[slug] || "Project visual";
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

function featuredCardComponent(project) {
  return project.underConstruction ? "article" : RouterLink;
}

function featuredCardProps(project) {
  return project.underConstruction ? {} : { to: `/projects/${project.slug}` };
}

function onFeaturedMove(e, project) {
  if (project.underConstruction) return;
  onCardMove(e, project.slug);
}

function onFeaturedLeave(project) {
  if (project.underConstruction) return;
  onCardLeave(project.slug);
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
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  margin-top: 10px;
  min-height: 340px;
}
.hero + .section {
  margin-top: clamp(16px, 2.2vw, 24px);
}
.left {
  max-width: 760px;
  position: relative;
  z-index: 1;
}
.right {
  display: grid;
  place-items: center;
  position: relative;
  min-height: 320px;
  z-index: 1;
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .right {
    order: -1;
    place-items: center;
    justify-self: center;
    width: 100%;
  }
}

/* ---- SHIMMER ACCENT TEXT ---- */
.shimmerAccent {
  --shimmer-base: var(--accent);
  --shimmer-highlight: #ffffff;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  font-family: inherit;
}

/* ---- ANIMATED CYCLING WORDS ---- */
.cyclingWrap {
  display: inline-block;
  position: relative;
  min-width: 160px;
  text-align: left;
}

.cyclingWord {
  display: inline-block;
  font-weight: 700;
  background: linear-gradient(110deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.wordCycle-enter-active {
  transition: opacity 320ms ease, transform 380ms cubic-bezier(0.2, 0.9, 0.2, 1);
}
.wordCycle-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.wordCycle-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.wordCycle-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}

/* ---- STAGGERED TEXT ENTRANCE ---- */
.title,
.sub {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(6px);
  transition: opacity 520ms ease, transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 520ms ease;
}
.title.in {
  transition-delay: 100ms;
}
.sub.in {
  transition-delay: 180ms;
}
.title.in,
.sub.in {
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
.sub {
  margin: 0;
  max-width: 760px;
  font-size: 18px;
  color: var(--muted);
  line-height: 1.5;
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
  transition: opacity 520ms ease, filter 520ms ease, transform 220ms ease;
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
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent) 22%, transparent),
    transparent 60%
  );
  z-index: -1;
}

/* ---- Portrait aura + orbit dots ---- */
.aura {
  position: absolute;
  inset: -14px;
  border-radius: 999px;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--accent) 38%, transparent);
  box-shadow: 0 0 0 10px color-mix(in srgb, var(--accent) 8%, transparent),
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
  0%,
  100% {
    transform: scale(0.985);
    opacity: 0.62;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.92;
  }
}
@keyframes orbitSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  transition: opacity 520ms ease, transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 520ms ease, box-shadow 160ms ease;
}
.featuredCard.in {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
.featuredCard.d0 {
  transition-delay: 260ms;
}
.featuredCard.d1 {
  transition-delay: 340ms;
}
.featuredCard.d2 {
  transition-delay: 420ms;
}
.featuredCard:hover {
  border-color: color-mix(in srgb, var(--accent) 34%, var(--border));
  box-shadow: 0 16px 30px color-mix(in srgb, var(--accent) 18%, transparent);
  transform: translateY(-4px);
}
.featuredCard.locked {
  cursor: not-allowed;
  border-style: dashed;
}
.featuredCard.locked:hover {
  transform: none;
  box-shadow: 0 10px 20px color-mix(in srgb, var(--accent) 10%, transparent);
}
.featuredCard::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--accent) 82%, white),
    color-mix(in srgb, var(--text) 66%, var(--accent))
  );
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
  color: color-mix(in srgb, #0f172a 78%, white);
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--accent) 78%, var(--tone)),
    color-mix(in srgb, var(--accent-2) 82%, var(--tone))
  );
  transform: translateZ(16px);
}
.visualCopy {
  min-width: 0;
}
.visualLabel {
  margin: 0;
  color: var(--text);
  font-size: 13px;
  font-weight: 850;
  letter-spacing: -0.01em;
}
.visualMeta {
  margin: 4px 0 0;
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
.underNote {
  margin: 8px 0 0;
  display: inline-flex;
  border-radius: var(--r-pill);
  border: 1px dashed color-mix(in srgb, var(--accent) 52%, var(--border));
  background: color-mix(in srgb, var(--accent-soft) 58%, transparent);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--text);
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

/* ---- EDUCATION — DISPLAY CARDS ---- */
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

@media (prefers-reduced-motion: reduce) {
  .title,
  .sub,
  .tilt,
  .featuredCard,
  .displayCard {
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
  .aura,
  .orbit,
  .orb {
    animation: none !important;
    filter: none !important;
  }
  .pfp {
    transform: none !important;
  }
  .visual {
    transform: none !important;
  }
  .wordCycle-enter-active,
  .wordCycle-leave-active {
    transition: none !important;
  }
}
@media (max-width: 760px) {
  .hero {
    justify-items: center;
  }
  .right {
    justify-items: center;
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
