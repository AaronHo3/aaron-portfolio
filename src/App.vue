<template>
  <div class="appShell">
    <div class="scrollProgress" :style="{ transform: `scaleX(${scrollProgress})` }" aria-hidden="true"></div>

    <TubelightNavbar />

    <main ref="mainRef" class="container">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <footer class="siteFooter">
      <div class="container footerInner">
        <div class="footerBrand">
          <img class="footerMark" :src="logoHref" alt="Aaron Ho logo" />
          <div>
            <strong>Aaron Ho - AI/ML for biotech and healthcare</strong>
            <p class="footerEdu">
              USC M.S. Biomedical Data Analytics • Fullstack Academy AI &amp; ML Bootcamp • Boston University
              Biochemistry &amp; Molecular Biology (Honors)
            </p>
          </div>
        </div>

        <nav class="footerLinks" aria-label="Footer contact links">
          <a href="mailto:aaronho0218@gmail.com">aaronho0218@gmail.com</a>
          <a href="https://www.linkedin.com/in/aaronho3/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/AaronHo3" target="_blank" rel="noreferrer">GitHub</a>
          <a :href="resumeHref" target="_blank" rel="noreferrer">Resume</a>
        </nav>
        <p class="buildStamp" :title="buildIso">Build: {{ buildDisplay }}</p>
      </div>
    </footer>

    <div class="themeDock">
      <ThemeToggle />
    </div>

    <button v-if="showTop" class="toTop" type="button" @click="scrollToTop" aria-label="Back to top">
      ↑ Top
    </button>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import TubelightNavbar from "./components/TubelightNavbar.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

const route = useRoute();
const resumeHref = `${import.meta.env.BASE_URL}AH_Resume.pdf`;
const logoHref = `${import.meta.env.BASE_URL}logo.png`;
const buildIso = __BUILD_TIME__;
const buildDisplay = new Date(buildIso).toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
const mainRef = ref(null);
const scrollProgress = ref(0);
const showTop = ref(false);

let observer;
let reduceMotionMq;

function isReducedMotion() {
  return Boolean(reduceMotionMq?.matches);
}

function onScroll() {
  const y = window.scrollY || 0;
  const full = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = full > 0 ? Math.min(1, y / full) : 0;
  showTop.value = y > 420;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupRevealObserver() {
  if (!mainRef.value || isReducedMotion()) return;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
  );

  const targets = mainRef.value.querySelectorAll(
    ".card:not(.featuredCard):not(.linkCard):not(.storyStep), .sectionTitle, .section > h1, .section > h2",
  );
  for (const el of targets) {
    el.classList.add("reveal");
    observer.observe(el);
  }
}

onMounted(() => {
  reduceMotionMq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  setupRevealObserver();
});

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    setupRevealObserver();
    onScroll();
  },
);

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  observer?.disconnect();
});
</script>

<style>
.scrollProgress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  z-index: 80;
  transform-origin: left;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 46%, transparent);
}

.appShell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

main.container {
  flex: 1;
  padding-top: 72px;
}

/* ---- Page transitions ---- */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.themeDock {
  position: fixed;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 60;
}

.toTop {
  position: fixed;
  right: 18px;
  bottom: 74px;
  z-index: 60;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 90%, var(--bg-elev));
  color: var(--text);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 850;
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 26px color-mix(in srgb, var(--accent) 16%, transparent);
  transition: transform 160ms ease, border-color 160ms ease;
}

.toTop:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
}

.reveal {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(6px);
  transition:
    opacity 460ms ease,
    transform 460ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 460ms ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
  filter: none;
}

.siteFooter {
  margin-top: 36px;
  position: relative;
  border-top: 1px solid color-mix(in srgb, var(--accent) 22%, var(--border));
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--bg-elev) 86%, var(--bg)),
    color-mix(in srgb, var(--bg) 95%, var(--bg-elev))
  );
}

.siteFooter::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: min(520px, 60%);
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), transparent);
  opacity: 0.72;
}

.footerInner {
  padding-top: 24px;
  padding-bottom: 84px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.footerBrand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footerMark {
  width: 44px;
  height: 44px;
  border-radius: 9px;
  object-fit: cover;
  border: 1px solid color-mix(in srgb, var(--text) 18%, var(--border));
  background: color-mix(in srgb, var(--bg-elev) 92%, black);
  box-shadow: 0 10px 20px color-mix(in srgb, black 42%, transparent);
}

.footerBrand strong {
  display: block;
  font-size: 14px;
}

.footerBrand p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.footerEdu {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.92;
}

.buildStamp {
  margin: 10px 0 0;
  width: 100%;
  color: color-mix(in srgb, var(--muted) 92%, var(--text));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.footerLinks {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.footerLinks a {
  color: var(--muted);
  text-decoration: none;
  font-weight: 800;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  background: color-mix(in srgb, var(--card) 70%, transparent);
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.footerLinks a:hover {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 32%, var(--border));
  background: color-mix(in srgb, var(--accent-soft) 50%, transparent);
  transform: translateY(-1px);
}

@media (max-width: 700px) {
  .themeDock {
    bottom: 8px;
  }

  .toTop {
    right: 12px;
    bottom: 66px;
  }

  .footerInner {
    padding-bottom: 96px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scrollProgress,
  .toTop,
  .reveal,
  .page-enter-active,
  .page-leave-active {
    transition: none !important;
    animation: none !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
</style>
