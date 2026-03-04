<template>
  <section class="section aboutPage">
    <div class="bento">
      <article class="card card-hero">
        <div class="hero-eyebrow">About me</div>
        <h1 class="hero-name">Aaron<br /><em>Ho.</em></h1>
        <p class="hero-role">AI Engineer · ML &amp; Analytics</p>
        <p class="hero-bio">
          I build systems that turn data into useful understanding. I care about strong technical execution, clear
          communication, and problems worth solving.
        </p>
        <div class="heroMedia">
          <div class="heroPhotoPlaceholder">Add photo in About Me box</div>
        </div>
        <div class="hero-decoration" aria-hidden="true"></div>
      </article>

      <article class="card card-status card-green">
        <div class="status-indicator">
          <div class="dot"></div>
          <span class="status-label">Currently available</span>
        </div>
        <div class="status-detail">Open to full-time roles &amp; collaborations</div>
      </article>

      <article class="card card-approach">
        <div class="card-label">The Way I Work</div>
        <div class="card-title">Curious by default. Methodical by habit.</div>
        <p class="card-body">
          I slow down before I speed up: understanding the problem fully before reaching for a solution. I break
          complexity into pieces and build from there.
        </p>
      </article>

      <article class="card card-values card-warm">
        <div class="card-label">What I Value</div>
        <div class="card-title">Principles that guide the work.</div>
        <div class="value-tags">
          <span class="value-tag">Ownership</span>
          <span class="value-tag">Clarity</span>
          <span class="value-tag">Craft</span>
          <span class="value-tag">Honesty</span>
          <span class="value-tag">Curiosity</span>
          <span class="value-tag">Growth</span>
        </div>
      </article>

      <article class="card card-photo card-photo-main">
        <div class="card-label">Photo</div>
        <img :src="profileSrc" alt="Aaron Ho portrait" />
      </article>

      <article class="card card-fivetonine card-dark">
        <div class="card-label">My "5-9"</div>
        <div class="card-title">Beyond the screen.</div>
        <p class="card-body">
          Outside work, I stay sharp by staying active, exploring new ideas, and spending time with people who
          challenge me to keep growing.
        </p>
      </article>

      <article class="card card-quote card-accent">
        <div class="card-label">A guiding thought</div>
        <p class="big-quote">"Motivation forgives mistakes, hesitation charges interest."</p>
        <p class="quote-attr">A personal favourite</p>
      </article>

      <article class="card card-photo card-photo-placeholder">
        <div class="card-label">Add a moment</div>
        <div class="photoPlaceholder">Drop in a second photo</div>
      </article>

    </div>
  </section>
</template>

<script setup>
import profileSrc from "../assets/profile.jpg";
</script>

<style scoped>
.aboutPage {
  margin-top: 14px;
  --page-bg: color-mix(in srgb, var(--bg) 94%, var(--bg-elev));
  --card-base: color-mix(in srgb, var(--card) 92%, var(--bg-elev));
  --card-ice: color-mix(in srgb, var(--accent) 16%, var(--card));
  --card-mist: color-mix(in srgb, var(--accent-2) 12%, var(--card));
  --card-soft: color-mix(in srgb, var(--accent) 10%, var(--bg));
  --card-dark: color-mix(in srgb, var(--bg) 84%, #060b16);
  --card-accent: linear-gradient(
    145deg,
    color-mix(in srgb, var(--accent-2) 40%, #12223f),
    color-mix(in srgb, var(--accent) 34%, #0a162b)
  );
  --text-ink: var(--text);
  --text-muted: var(--muted);
  --accent-main: var(--accent);
  --accent-soft: color-mix(in srgb, var(--accent) 18%, var(--bg-elev));
  --border-soft: color-mix(in srgb, var(--border) 70%, var(--accent) 30%);
}

.bento {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--page-bg);
  border: 1px solid color-mix(in srgb, var(--border-soft) 86%, var(--bg-elev));
  border-radius: 22px;
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 18px;
}

.card {
  background: var(--card-base);
  border-radius: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: "Figtree", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  color: var(--text-ink);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 60px color-mix(in srgb, var(--accent-main) 22%, transparent);
}

.card-dark {
  background: var(--card-dark);
  color: color-mix(in srgb, var(--text-ink) 92%, white);
}

.card-accent {
  background: var(--card-accent);
  color: color-mix(in srgb, var(--text-ink) 88%, white);
}

.card-warm {
  background: var(--card-soft);
}

.card-green {
  background: var(--card-ice);
}

.card-hero {
  background: var(--card-mist);
  padding-right: 320px;
}

.card-approach {
  background: var(--card-base);
}

.card-values {
  background: var(--card-soft);
}

.card-hero {
  grid-column: 1 / span 7;
  grid-row: 1 / span 2;
}

.card-status {
  grid-column: 8 / span 5;
  grid-row: 1;
}

.card-approach {
  grid-column: 8 / span 5;
  grid-row: 2;
}

.card-values {
  grid-column: 1 / span 4;
  grid-row: 3;
}

.card-quote {
  grid-column: 1 / span 6;
  grid-row: 4;
}

.card-fivetonine {
  grid-column: 9 / span 4;
  grid-row: 3;
}

.card-photo-main {
  grid-column: 5 / span 4;
  grid-row: 3;
  padding: 14px;
}

.card-photo-placeholder {
  grid-column: 7 / span 6;
  grid-row: 4;
}

.hero-eyebrow {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent-main);
  margin-bottom: 20px;
  font-weight: 500;
}

.hero-name {
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -2px;
  margin-bottom: 16px;
}

.hero-name em {
  font-style: normal;
  color: var(--accent-main);
}

.hero-role {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 32px;
  font-weight: 300;
}

.hero-bio {
  font-size: 15px;
  line-height: 1.75;
  color: color-mix(in srgb, var(--text-ink) 80%, var(--text-muted));
  max-width: 420px;
}

.heroMedia {
  width: 190px;
  position: absolute;
  top: 50%;
  right: 34px;
  transform: translateY(-50%);
  z-index: 2;
}

.heroPhotoPlaceholder {
  min-height: 270px;
  aspect-ratio: 3 / 5;
  border-radius: 12px;
  border: 1px dashed color-mix(in srgb, var(--accent-main) 42%, var(--border-soft));
  background: color-mix(in srgb, var(--accent-main) 12%, var(--card-base));
  display: grid;
  place-items: center;
  text-align: center;
  color: color-mix(in srgb, var(--text-ink) 76%, var(--text-muted));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 10px;
}

.hero-decoration {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 40px solid var(--accent-soft);
  opacity: 0.6;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-main);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent-main) 40%, transparent); }
  50% { opacity: 0.8; box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent-main) 0%, transparent); }
}

.status-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: color-mix(in srgb, var(--text-ink) 88%, var(--text-muted));
}

.status-detail {
  font-size: 22px;
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  line-height: 1.3;
}

.card-label {
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
  font-weight: 500;
}

.card-dark .card-label {
  color: color-mix(in srgb, var(--text-muted) 75%, #9ca3af);
}

.card-accent .card-label {
  color: color-mix(in srgb, var(--text-ink) 56%, #b5c8ee);
}

.card-title {
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: 26px;
  line-height: 1.2;
  margin-bottom: 14px;
  letter-spacing: -0.5px;
}

.card-dark .card-title {
  color: color-mix(in srgb, var(--text-ink) 92%, white);
}

.card-accent .card-title {
  color: color-mix(in srgb, var(--text-ink) 92%, white);
}

.card-body {
  font-size: 13px;
  line-height: 1.7;
  color: color-mix(in srgb, var(--text-ink) 72%, var(--text-muted));
}

.card-dark .card-body {
  color: color-mix(in srgb, var(--text-muted) 88%, #b9c5d9);
}

.card-accent .card-body {
  color: color-mix(in srgb, var(--text-ink) 76%, #b8c9e5);
}

.card-quote {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.card-quote .card-label,
.card-quote .quote-attr {
  text-align: center;
}

.value-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.value-tag {
  padding: 5px 12px;
  background: color-mix(in srgb, var(--accent-main) 18%, var(--card-base));
  color: color-mix(in srgb, var(--accent-main) 72%, var(--text-ink));
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.big-quote {
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: clamp(24px, 2.35vw, 34px);
  line-height: 1.34;
  color: color-mix(in srgb, var(--text-ink) 90%, white);
  margin: 8px 0 16px;
}

.quote-attr {
  font-size: 11px;
  color: color-mix(in srgb, #a7bbdd 74%, var(--text-ink));
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-photo {
  background: color-mix(in srgb, var(--accent-main) 9%, var(--card-base));
}

.card-photo img {
  width: 100%;
  height: 100%;
  min-height: 260px;
  max-height: 340px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--border-soft) 88%, var(--bg-elev));
}

.photoPlaceholder {
  min-height: 260px;
  border-radius: 14px;
  border: 1px dashed color-mix(in srgb, var(--accent-main) 40%, var(--border-soft));
  background: color-mix(in srgb, var(--accent-main) 10%, var(--card-base));
  display: grid;
  place-items: center;
  text-align: center;
  color: color-mix(in srgb, var(--text-ink) 74%, var(--text-muted));
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 14px;
}

@media (max-width: 1100px) {
  .bento {
    grid-template-columns: repeat(6, 1fr);
  }

  .card-hero {
    grid-column: span 6;
    grid-row: span 2;
  }

  .card-status,
  .card-approach {
    grid-column: span 6;
    grid-row: auto;
  }

  .card-values,
  .card-quote,
  .card-fivetonine,
  .card-photo-main,
  .card-photo-placeholder {
    grid-column: span 3;
    grid-row: auto;
  }
}

@media (max-width: 820px) {
  .bento {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 12px;
  }

  .card-status,
  .card-approach,
  .card-values,
  .card-quote,
  .card-fivetonine,
  .card-photo-main,
  .card-photo-placeholder {
    grid-column: 1;
    grid-row: auto;
  }

  .card {
    padding: 24px;
  }

  .hero-name {
    font-size: 52px;
  }

  .heroMedia {
    position: static;
    width: auto;
    transform: none;
    margin-top: 16px;
  }

  .card-hero {
    padding-right: 24px;
  }
}
</style>
