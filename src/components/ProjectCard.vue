<template>
  <RouterLink class="card linkCard" :to="`/projects/${project.slug}`">
    <div class="top">
      <h3>{{ project.title }}</h3>
      <span class="chev">View</span>
    </div>

    <p class="muted">{{ project.subtitle }}</p>

    <div class="tags">
      <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
});
</script>

<style scoped>
.linkCard {
  display: block;
  text-decoration: none;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.linkCard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

h3 {
  margin: 0;
  letter-spacing: -0.01em;
  font-size: 16px;
}

.muted {
  margin: 10px 0 0;
  color: var(--muted);
  line-height: 1.5;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tag {
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 6px 10px;
  font-weight: 850;
  font-size: 12px;
  color: var(--muted);
}

.chev {
  color: var(--muted);
  font-weight: 900;
  font-size: 12px;
}
</style>