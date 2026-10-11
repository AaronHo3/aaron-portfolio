<template>
  <footer class="siteFooter">
    <div class="container footerInner">
      <div class="footerId">
        <p class="footerName">{{ profile.name }}</p>
        <p class="meta">{{ profile.tagline }}</p>
      </div>
      <nav aria-label="Contact and profiles">
        <ul class="footerLinks">
          <li><a :href="`mailto:${profile.email}`">Email</a></li>
          <li><a :href="profile.links.linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a :href="profile.links.github" target="_blank" rel="noopener">GitHub</a></li>
          <li><a :href="resumeHref" target="_blank" rel="noopener">Resume</a></li>
          <li><a href="/rss.xml">RSS</a></li>
        </ul>
      </nav>
      <p class="meta copyright">© {{ year }} {{ profile.name }}</p>
    </div>
  </footer>
</template>

<script setup>
import { profile } from "../../data/profile.js";

const resumeHref = `${import.meta.env.BASE_URL}${profile.resumePath}`;
const year = new Date().getFullYear();
</script>

<style scoped>
.siteFooter {
  border-top: var(--border);
  margin-top: var(--space-8);
}

.footerInner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4) var(--space-6);
  padding-block: var(--space-6);
}

.footerName {
  font-weight: 700;
}

.footerLinks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-5);
  margin: 0;
  padding: 0;
  list-style: none;
}

.footerLinks a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--color-text-muted);
  font-size: var(--fs-small);
  font-weight: 600;
  text-decoration: none;
}

.footerLinks a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.copyright {
  width: 100%;
}
</style>
