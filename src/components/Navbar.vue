<template>
  <header class="nav">
    <div class="container navInner">
      <RouterLink class="brand" to="/">Aaron Ho</RouterLink>

      <nav class="links">
        <RouterLink to="/projects">Projects</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <a class="btn" :href="resumeHref" target="_blank" rel="noreferrer">Resume</a>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from "./ThemeToggle.vue";

const resumeHref = `${import.meta.env.BASE_URL}Resume_Aaron_Ho.pdf`;
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  border-bottom: 1px solid var(--border);
}

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
}

.links {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.links a {
  text-decoration: none;
  font-weight: 800;
  color: var(--muted);
}

.links a.router-link-active {
  color: var(--text);
}
</style>