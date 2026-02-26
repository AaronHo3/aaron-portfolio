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
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
  background: var(--card);
  color: var(--text);
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--text);
  box-shadow: var(--shadow);
}

.text {
  opacity: 0.85;
  font-size: 13px;
}
</style>