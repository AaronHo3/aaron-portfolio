<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="left">
        <div class="pill" :class="{ in: mounted }">Biomedical Data Analytics • AI/ML • Visualization</div>

        <h1 class="title" :class="{ in: mounted }">
          Hi, I’m <span class="accent">Aaron</span> — I build data-driven tools for healthcare & biotech.
        </h1>

        <p class="sub" :class="{ in: mounted }">
          Projects in EEG classification, CT imaging, neural decoding, and digital twins. I like shipping clean,
          explainable models and interactive dashboards.
        </p>

        <div class="cta" :class="{ in: mounted }">
          <RouterLink class="btn primary" to="/projects">View Projects</RouterLink>
          <a class="btn" :href="resumeHref" target="_blank" rel="noreferrer">Resume</a>
          <RouterLink class="btn" to="/contact">Contact</RouterLink>
        </div>

        <div class="trustRow" :class="{ in: mounted }">
          <div class="trustStat">
            <strong>6+</strong>
            <span>Applied AI projects</span>
          </div>
          <div class="trustStat">
            <strong>Healthcare + Biotech</strong>
            <span>Domain focus</span>
          </div>
          <div class="trustStat">
            <strong>Dashboards to Deployment</strong>
            <span>End-to-end builds</span>
          </div>
        </div>
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
          <div class="ring" aria-hidden="true"></div>
          <div class="ring2" aria-hidden="true"></div>
          <img class="pfp" :src="profileSrc" alt="Portrait of Aaron Ho" />
        </div>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="section">
      <div class="featuredHead">
        <h2 class="sectionTitle">Featured Projects</h2>
        <RouterLink class="btn" to="/projects">All projects →</RouterLink>
      </div>

      <div class="grid">
        <RouterLink
          v-for="(p, i) in featured"
          :key="p.slug"
          class="card featuredCard"
          :class="[{ in: mounted }, `d${i}`]"
          :to="`/projects/${p.slug}`"
        >
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
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import profileSrc from "../assets/profile.jpg";
import { projects } from "../data/projects";

const mounted = ref(false);
const resumeHref = `${import.meta.env.BASE_URL}Resume_Aaron_Ho.pdf`;

/* choose featured projects (first 3 for now) */
const featured = computed(() => projects.slice(0, 3));

/* tilt state */
const rx = ref(0);
const ry = ref(0);

const tiltStyle = computed(() => ({
  transform: `perspective(900px) rotateX(${rx.value}deg) rotateY(${ry.value}deg) translateY(${mounted.value ? 0 : 10}px) scale(${mounted.value ? 1 : 0.98})`,
}));

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true;
  });
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
</script>

<style scoped>
/* ---- HERO LAYOUT ---- */
.hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: center;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
  .right { order: -1; display: grid; place-items: start; }
}

/* ---- STAGGERED TEXT ENTRANCE ---- */
.pill,
.title,
.sub,
.cta,
.trustRow {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(6px);
  transition:
    opacity 520ms ease,
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 520ms ease;
}

.pill.in { transition-delay: 60ms; }
.title.in { transition-delay: 140ms; }
.sub.in { transition-delay: 220ms; }
.cta.in { transition-delay: 300ms; }
.trustRow.in { transition-delay: 360ms; }

.pill.in,
.title.in,
.sub.in,
.cta.in,
.trustRow.in {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.pill {
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  font-weight: 900;
  font-size: 13px;
  color: var(--muted);
}

h1 {
  margin: 16px 0 10px;
  font-size: clamp(34px, 5vw, 56px);
  letter-spacing: -0.03em;
  line-height: 1.06;
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

.cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
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
  border-radius: 999px;

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

/* More noticeable ring pulse:
   - thicker border
   - bigger scale swing
   - subtle glow
*/
/* ---- Gradient animated halo ring ---- */
.ring {
  position: absolute;
  inset: -18px;
  border-radius: 999px;
  pointer-events: none;

  background:
    conic-gradient(
      from 0deg,
      color-mix(in srgb, var(--text) 65%, transparent),
      transparent 25%,
      color-mix(in srgb, var(--text) 40%, transparent),
      transparent 60%,
      color-mix(in srgb, var(--text) 70%, transparent)
    );

  mask:
    radial-gradient(circle, transparent 62%, black 63%);
  -webkit-mask:
    radial-gradient(circle, transparent 62%, black 63%);

  filter: blur(6px);
  opacity: 0.85;

  animation:
    ringRotate 9s linear infinite,
    ringPulse 3.6s ease-in-out infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg) scale(0.98); }
  to   { transform: rotate(360deg) scale(1.02); }
}

@keyframes ringPulse {
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.9; }
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

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .pill, .title, .sub, .cta, .trustRow, .tilt, .featuredCard {
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
  .ring, .ring2 { animation: none !important; filter: none !important; }
  .pfp { transform: none !important; }
}

@media (max-width: 760px) {
  .trustRow {
    grid-template-columns: 1fr;
  }
}
</style>
