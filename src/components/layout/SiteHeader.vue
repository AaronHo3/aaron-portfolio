<template>
  <header class="siteHeader">
    <div class="container headerInner">
      <RouterLink class="brand" to="/" aria-label="Aaron Ho, home">
        <img class="brandMark" :src="logoSrc" alt="" width="32" height="32" />
        <span class="brandName">Aaron Ho</span>
      </RouterLink>

      <nav class="desktopNav" aria-label="Main">
        <ul class="navList">
          <li v-for="item in NAV_ITEMS" :key="item.to">
            <RouterLink class="navLink" :to="item.to" :aria-current="isActive(item) ? 'page' : undefined">
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="headerActions">
        <a class="btn btn-sm resumeLink" :href="resumeHref" target="_blank" rel="noopener">
          Resume<span class="visually-hidden"> (PDF, opens in a new tab)</span>
        </a>
        <button class="iconButton" type="button" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
          <Moon v-if="theme === 'light'" :size="20" aria-hidden="true" />
          <Sun v-else :size="20" aria-hidden="true" />
        </button>
        <button
          ref="menuButton"
          class="iconButton menuButton"
          type="button"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" aria-hidden="true" />
          <Menu v-else :size="22" aria-hidden="true" />
          <span class="visually-hidden">{{ menuOpen ? "Close menu" : "Open menu" }}</span>
        </button>
      </div>
    </div>

    <nav v-show="menuOpen" id="mobile-menu" class="mobileNav" aria-label="Main" @keydown.esc="closeMenu(true)">
      <ul class="container mobileList">
        <li v-for="item in NAV_ITEMS" :key="item.to">
          <RouterLink class="mobileLink" :to="item.to" :aria-current="isActive(item) ? 'page' : undefined">
            {{ item.label }}
          </RouterLink>
        </li>
        <li>
          <a class="mobileLink" :href="resumeHref" target="_blank" rel="noopener">
            Resume<span class="visually-hidden"> (PDF, opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Menu, Moon, Sun, X } from "lucide-vue-next";
import { profile } from "../../data/profile.js";
import { theme, toggleTheme } from "../../lib/theme.js";

/** `match` lists path prefixes that mark the item as current. */
const NAV_ITEMS = [
  { label: "Home", to: "/", match: [] },
  { label: "Projects", to: "/projects", match: ["/projects"] },
  { label: "Blogging", to: "/blog", match: ["/blog", "/reading-club"] },
  { label: "About", to: "/about", match: ["/about"] },
  { label: "Contact", to: "/contact", match: ["/contact"] },
];

const route = useRoute();
const menuOpen = ref(false);
const menuButton = ref(null);

const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
const resumeHref = `${import.meta.env.BASE_URL}${profile.resumePath}`;
const themeLabel = computed(() => (theme.value === "dark" ? "Switch to light theme" : "Switch to dark theme"));

function isActive(item) {
  if (item.to === "/") return route.path === "/";
  return item.match.some((prefix) => route.path === prefix || route.path.startsWith(`${prefix}/`));
}

function closeMenu(returnFocus = false) {
  if (!menuOpen.value) return;
  menuOpen.value = false;
  if (returnFocus) nextTick(() => menuButton.value?.focus());
}

// Close the menu after navigating, and if the viewport grows past mobile.
watch(() => route.fullPath, () => closeMenu());
let desktopMq;
const onMq = (e) => e.matches && closeMenu();
onMounted(() => {
  desktopMq = window.matchMedia("(min-width: 861px)");
  desktopMq.addEventListener("change", onMq);
});
onBeforeUnmount(() => desktopMq?.removeEventListener("change", onMq));
</script>

<style scoped>
.siteHeader {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  border-bottom: var(--border);
  backdrop-filter: saturate(1.2) blur(8px);
}

.headerInner {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  min-height: var(--header-h);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
}

.brand:hover {
  color: var(--color-text);
}

.brandMark {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.desktopNav {
  margin-left: auto;
}

.navList {
  display: flex;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.navLink {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--fs-small);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid transparent;
}

.navLink:hover {
  color: var(--color-text);
}

.navLink[aria-current="page"] {
  color: var(--color-text);
  border-bottom-color: var(--color-accent);
}

.headerActions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.iconButton {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.iconButton:hover {
  border-color: var(--color-border);
  background: var(--color-surface);
}

.menuButton {
  display: none;
}

.mobileNav {
  border-top: var(--border);
  background: var(--color-bg);
}

.mobileList {
  margin: 0;
  padding-block: var(--space-2) var(--space-4);
  list-style: none;
}

.mobileLink {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding-inline: var(--space-2);
  color: var(--color-text);
  font-weight: 600;
  text-decoration: none;
  border-bottom: var(--border);
}

.mobileLink[aria-current="page"] {
  color: var(--color-accent);
  box-shadow: inset 3px 0 0 var(--color-accent);
  padding-left: var(--space-4);
}

@media (max-width: 860px) {
  .desktopNav,
  .resumeLink {
    display: none;
  }
  .headerActions {
    margin-left: auto;
  }
  .menuButton {
    display: inline-grid;
  }
}

@media (min-width: 861px) {
  .mobileNav {
    display: none !important;
  }
}
</style>
