<template>
  <header class="nav" :class="{ compact: scrolled }">
    <div class="container navContainer">
      <div class="navInner">
        <RouterLink class="brand" to="/">Aaron Ho</RouterLink>

        <nav class="links">
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

          <ThemeToggle />
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import ThemeToggle from "./ThemeToggle.vue";

const resumeHref = `${import.meta.env.BASE_URL}Resume_Aaron_Ho.pdf`;
const scrolled = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > 18;
}

onMounted(() => {
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

/* Override container padding for nav only */
.navContainer {
  padding: 14px 20px;
  transition: padding 220ms ease;
}

.nav.compact .navContainer {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Layout */
.navInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.brand {
  font-weight: 900;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--text);
}

/* Links */
.links {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.navLink {
  padding: 6px 12px;
  border-radius: var(--r-pill);
  border: 1px solid transparent;
  text-decoration: none;
  font-weight: 850;
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
</style>
