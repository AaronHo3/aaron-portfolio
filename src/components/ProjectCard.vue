<template>
  <button class="card" type="button">
    <div class="top">
      <h3>{{ project.title }}</h3>
      <span class="hint">View</span>
    </div>
    <p>{{ project.description }}</p>
    <div class="tags">
      <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
    </div>
  </button>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
});
</script>

<style scoped>
.card {
  text-align: left;
  width: 100%;
  border: 1px solid rgba(0,0,0,0.12);
  background: white;
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(0,0,0,0.08); }
.top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
h3 { margin: 0; font-size: 16px; letter-spacing: -0.01em; }
p { margin: 10px 0 0; color: rgba(0,0,0,0.65); line-height: 1.5; }
.hint { color: rgba(0,0,0,0.45); font-weight: 800; font-size: 12px; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.tag { border: 1px solid rgba(0,0,0,0.12); border-radius: 999px; padding: 6px 10px; font-weight: 800; font-size: 12px; color: rgba(0,0,0,0.6); }
</style>