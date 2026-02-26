<template>
  <main class="wrap">
    <header class="hero">
      <h1>Aaron Ho</h1>
      <p>Biomedical Engineer • AI/ML • Digital Twins • Neuro</p>

      <div class="buttons">
        <a class="btn" href="#projects">View Projects</a>
        <a class="btn outline" href="https://github.com/AaronHo3" target="_blank" rel="noreferrer">GitHub</a>
        <a class="btn outline" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </header>

    <section id="projects" class="section">
      <h2>Projects</h2>
      <div class="grid">
        <article class="card">
          <h3>EEG Seizure Classification</h3>
          <p>CHB-MIT windows + ML ensemble, ROC/AUC evaluation.</p>
        </article>
        <article class="card">
          <h3>Lung Nodule Detection</h3>
          <p>U-Net segmentation + ResNet50 classification on LUNA16.</p>
        </article>
        <article class="card">
          <h3>Neural Decoding</h3>
          <p>Poisson HMM vs RCNN for imagined handwriting decoding.</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style>
.wrap {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 20px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}
.hero h1 {
  font-size: 52px;
  margin: 0 0 8px;
}
.hero p {
  font-size: 18px;
  opacity: 0.8;
  margin: 0 0 18px;
}
.buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 10px;
  background: #111;
  color: white;
  text-decoration: none;
  font-weight: 600;
}
.btn.outline {
  background: transparent;
  color: #111;
  border: 2px solid #111;
}
.section {
  margin-top: 48px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
  margin-top: 14px;
}
.card {
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 14px;
  padding: 14px;
}
.card h3 {
  margin: 0 0 8px;
}
</style>