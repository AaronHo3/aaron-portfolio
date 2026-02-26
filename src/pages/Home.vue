<template>
  <section class="hero">
    <div class="pill">Biomedical Data Analytics • AI/ML • Visualization</div>
    <h1>
      Building <span class="accent">explainable</span> ML and dashboards for healthcare & biotech.
    </h1>
    <p class="sub">
      MS BME @ USC. Projects in EEG, CT imaging, neural decoding, and digital twins.
    </p>

    <div class="cta">
      <RouterLink class="btn primary" to="/projects">View Projects</RouterLink>
      <a class="btn" href="https://github.com/AaronHo3" target="_blank" rel="noreferrer">GitHub</a>
      <a class="btn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
    </div>
  </section>
</template>

<style scoped>
.hero { padding: 34px 0 10px; }
.pill {
  display: inline-block;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-weight: 900;
  font-size: 13px;
  color: var(--muted);
}
h1 {
  margin: 16px 0 10px;
  font-size: clamp(34px, 5vw, 56px);
  letter-spacing: -0.03em;
  line-height: 1.06;
}
.accent { text-decoration: underline; text-decoration-thickness: 6px; text-underline-offset: 6px; }
.sub { margin: 0; max-width: 760px; font-size: 18px; color: var(--muted); line-height: 1.5; }
.cta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 18px; }
</style>