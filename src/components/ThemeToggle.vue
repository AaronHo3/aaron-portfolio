<template>
  <button class="toggle" type="button" @click="toggleTheme" :aria-label="label">
    <span class="dot" />
    <span class="text">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed, ref } from "vue";

const theme = ref(getInitialTheme());
applyTheme(theme.value);

const label = computed(() => (theme.value === "dark" ? "Dark" : "Light"));

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
}

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  applyTheme(theme.value);
}
</script>

<style scoped>
.toggle {
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 84%, var(--bg-elev));
  color: var(--text);
  border-radius: 999px;
  padding: 7px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--accent) 10%, transparent);
  opacity: 0.62;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, opacity 160ms ease;
}

.toggle:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--accent) 28%, var(--border));
  box-shadow: 0 10px 18px color-mix(in srgb, var(--accent) 15%, transparent);
  opacity: 0.94;
}

.toggle:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent) 36%, transparent);
  outline-offset: 3px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--bg-elev);
  border: 1px solid color-mix(in srgb, var(--text) 16%, var(--border));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 10%, transparent);
}

.text {
  opacity: 0.82;
  font-size: 11px;
  letter-spacing: 0.02em;
}
</style>
