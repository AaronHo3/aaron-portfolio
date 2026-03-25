<template>
  <div class="tubelightWrap">
    <nav class="tubelight" aria-label="Main navigation">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="item.url"
        class="tubeItem"
        :class="{ active: activeTab === item.name }"
        @click="activeTab = item.name"
      >
        <span class="tubeLabel">{{ item.name }}</span>
        <component :is="item.icon" class="tubeIcon" :size="18" :stroke-width="2.5" />

        <!-- Tubelight glow indicator -->
        <div v-if="activeTab === item.name" class="tubeGlow">
          <div class="glowBar" />
          <div class="glowBlur1" />
          <div class="glowBlur2" />
          <div class="glowBlur3" />
        </div>

        <!-- Active background pill -->
        <div v-if="activeTab === item.name" class="activeBg" />
      </RouterLink>

      <a
        class="tubeItem resumeLink"
        :href="resumeHref"
        target="_blank"
        rel="noreferrer"
      >
        <span class="tubeLabel">Resume</span>
        <FileText class="tubeIcon" :size="18" :stroke-width="2.5" />
      </a>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Home, User, Briefcase, Mail, FileText } from "lucide-vue-next";

const route = useRoute();

const items = [
  { name: "Home", url: "/", icon: Home },
  { name: "Projects", url: "/projects", icon: Briefcase },
  { name: "About", url: "/about", icon: User },
  { name: "Contact", url: "/contact", icon: Mail },
];

const resumeHref = `${import.meta.env.BASE_URL}AH_Resume.pdf`;

function routeToTab(path) {
  if (path === "/" || path === "") return "Home";
  if (path.startsWith("/projects")) return "Projects";
  if (path.startsWith("/about")) return "About";
  if (path.startsWith("/contact")) return "Contact";
  return "Home";
}

const activeTab = ref(routeToTab(route.path));

watch(() => route.path, (newPath) => {
  activeTab.value = routeToTab(newPath);
});
</script>

<style scoped>
.tubelightWrap {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  padding-top: calc(14px + env(safe-area-inset-top, 0px));
  pointer-events: none;
}

.tubelight {
  display: flex;
  align-items: center;
  gap: 3px;
  background: color-mix(in srgb, var(--bg-elev) 60%, transparent);
  border: 1px solid var(--border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 4px;
  border-radius: 999px;
  box-shadow: 0 8px 32px color-mix(in srgb, black 28%, transparent);
  pointer-events: auto;
}

.tubeItem {
  position: relative;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  padding: 8px 20px;
  border-radius: 999px;
  text-decoration: none;
  color: color-mix(in srgb, var(--text) 70%, var(--muted));
  transition: color 180ms ease;
}

.tubeItem:hover {
  color: var(--accent);
}

.tubeItem.active {
  color: var(--accent);
}

.tubeLabel {
  position: relative;
  z-index: 2;
}

.tubeIcon {
  display: none;
  position: relative;
  z-index: 2;
}

/* Active background pill */
.activeBg {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border-radius: 999px;
  z-index: 0;
}

/* Tubelight glow on top */
.tubeGlow {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  pointer-events: none;
}

.glowBar {
  width: 32px;
  height: 4px;
  background: var(--accent);
  border-radius: 999px 999px 0 0;
}

.glowBlur1 {
  position: absolute;
  width: 48px;
  height: 24px;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--accent) 25%, transparent);
  border-radius: 999px;
  filter: blur(10px);
}

.glowBlur2 {
  position: absolute;
  width: 32px;
  height: 24px;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--accent) 25%, transparent);
  border-radius: 999px;
  filter: blur(8px);
}

.glowBlur3 {
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--accent) 25%, transparent);
  border-radius: 999px;
  filter: blur(6px);
}

.resumeLink {
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 80%, transparent);
}

.resumeLink:hover {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}

/* Mobile: show icons instead of labels */
@media (max-width: 640px) {
  .tubeLabel {
    display: none;
  }

  .tubeIcon {
    display: block;
  }

  .tubeItem {
    padding: 8px 14px;
  }
}
</style>
