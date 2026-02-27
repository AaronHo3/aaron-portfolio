<template>
  <header class="nav" :class="{ compact: scrolled, collapsed: collapsed }">
    <div class="container navContainer">
      <div class="navInner">
        <RouterLink class="brand" to="/">
          <span class="brandMark" aria-hidden="true">AH</span>
          <span class="brandText">
            <strong>Aaron Ho</strong>
            <small>Home</small>
          </span>
        </RouterLink>

        <nav class="links" :aria-hidden="collapsed ? 'true' : 'false'">
          <RouterLink class="navLink" to="/">Home</RouterLink>
          <RouterLink class="navLink" to="/projects">Projects</RouterLink>
          <RouterLink class="navLink" to="/about">About</RouterLink>
          <RouterLink class="navLink" to="/contact">Contact</RouterLink>

          <a
            class="btn"
            :href="resumeHref"
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const resumeHref = `${import.meta.env.BASE_URL}Resume_Aaron_Ho.pdf`;
const scrolled = ref(false);
const collapsed = ref(false);
let lastY = 0;
const COLLAPSE_SCROLL_Y = 120;
const EXPAND_SCROLL_Y = 88;
const DIRECTION_THRESHOLD = 4;

function onScroll() {
  const y = Math.max(0, window.scrollY || 0);
  scrolled.value = y > 18;
  const delta = y - lastY;

  // Ignore micro-jitter near boundaries (notably at page bottom on some browsers).
  if (Math.abs(delta) < DIRECTION_THRESHOLD) {
    lastY = y;
    return;
  }

  if (y <= EXPAND_SCROLL_Y) {
    collapsed.value = false;
  } else if (delta > 0 && y >= COLLAPSE_SCROLL_Y) {
    collapsed.value = true;
  } else if (delta < 0) {
    collapsed.value = false;
  }

  lastY = y;
}

onMounted(() => {
  lastY = window.scrollY || 0;
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
/* Sticky glass nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: color-mix(in srgb, var(--bg-elev) 75%, transparent);
  border-bottom: 1px solid var(--border);
  transition: background 220ms ease, border-color 220ms ease;
}

.nav.compact {
  background: color-mix(in srgb, var(--bg-elev) 86%, transparent);
  border-bottom-color: color-mix(in srgb, var(--accent) 28%, var(--border));
}

.nav.collapsed {
  background: color-mix(in srgb, var(--bg-elev) 90%, transparent);
}

/* Override container padding for nav only */
.navContainer {
  padding: 12px 20px;
  transition: padding 220ms ease;
}

.nav.compact .navContainer {
  padding-top: 10px;
  padding-bottom: 10px;
}

.nav.collapsed .navContainer {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Layout */
.navInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  transition: min-height 220ms ease;
}

.nav.collapsed .navInner {
  justify-content: flex-start;
}

.nav.collapsed:hover .navInner,
.nav.collapsed:focus-within .navInner {
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--text);
}

.brandMark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, white 90%, var(--bg));
  background: linear-gradient(140deg, var(--text), color-mix(in srgb, var(--text) 68%, var(--accent)));
  box-shadow: 0 10px 20px color-mix(in srgb, var(--accent) 16%, transparent);
}

.brandText {
  display: grid;
  line-height: 1.08;
  transition: opacity 180ms ease, transform 180ms ease;
}

.brandText strong {
  font-size: 15px;
}

.brandText small {
  font-size: 11px;
  color: var(--muted);
  font-weight: 800;
}

/* Links */
.links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: opacity 180ms ease, transform 180ms ease, width 180ms ease;
}

.links::-webkit-scrollbar {
  display: none;
}

.nav.collapsed .brandText {
  opacity: 0;
  transform: translateX(-6px);
  width: 0;
  overflow: hidden;
}

.nav.collapsed .links {
  opacity: 0;
  transform: translateX(8px);
  pointer-events: none;
  width: 0;
  overflow: hidden;
}

.nav.collapsed:hover .brandText,
.nav.collapsed:focus-within .brandText {
  opacity: 1;
  transform: none;
  width: auto;
  overflow: visible;
}

.nav.collapsed:hover .links,
.nav.collapsed:focus-within .links {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  width: auto;
  overflow-x: auto;
}

.navLink {
  padding: 5px 10px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  color: var(--muted);
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease;
}

.navLink:hover {
  color: var(--text);
  background: color-mix(in srgb, var(--accent-soft) 60%, transparent);
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
}

/* Active route highlight */
.navLink.router-link-active {
  color: var(--text);
  background: color-mix(in srgb, var(--accent-soft) 80%, transparent);
  border-color: color-mix(in srgb, var(--accent) 34%, transparent);
}

/* Keep the glint animation, remove the rectangular hover glow in header actions */
.links .btn {
  box-shadow: none;
}

.links .btn:hover {
  box-shadow: none;
  filter: none;
}

@media (max-width: 780px) {
  .brandMark {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    font-size: 10px;
  }

  .brandText strong {
    font-size: 14px;
  }

  .brandText small {
    display: none;
  }
}
</style>
