<template>
  <section class="section aboutPage">
    <div class="bento">
      <article class="card card-hero">
        <div class="heroTop">
          <div class="heroCopy">
            <div class="hero-eyebrow">About me</div>
            <h1 class="hero-name">Aaron<br /><em>Ho.</em></h1>
            <p class="hero-role">Dog Lover · Curious by nature</p>
            <p class="hero-bio hero-bio-lead">
              I’ve always been drawn to understanding how things work, especially complex systems and challenging
              problems. I enjoy breaking ideas down, learning from different perspectives, and building things that can
              make a real impact.
            </p>
          </div>
          <div class="heroMedia">
            <img class="heroPhoto" :src="osakaCastlePhoto" alt="Aaron smiling by Osaka Castle steps" />
            <p class="heroPhotoCaption">Osaka Castle Dec 2025</p>
          </div>
        </div>
        <p class="hero-bio hero-bio-full">
          Curiosity, thoughtful problem-solving, and continuous growth are values I try to carry with me in
          everything I do.
        </p>
      </article>

      <article class="card card-status card-green">
        <div class="status-indicator">
          <div class="dot"></div>
          <span class="status-label">Currently available</span>
        </div>
        <div class="status-detail">Open to full-time roles &amp; collaborations</div>
      </article>

      <article class="card card-approach">
        <div class="card-label">Currently Exploring</div>
        <div class="card-title explore-title">Focus areas right now.</div>
        <ul class="explore-list">
          <li>Personalized/Precision Medicine</li>
          <li>Digital Twins</li>
          <li>Disease Diagnosis and Prognostics</li>
          <li>AI-Assisted Robotic Surgery</li>
        </ul>
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
        <div class="card-label">What I Love</div>
        <img class="photoMainImg" :src="momoPhoto" alt="Momo the dog" />
        <p class="photoCaption">Momo</p>
      </article>

      <article class="card card-fivetonine card-dark">
        <div class="card-label">My "5-9"</div>
        <div class="card-title">Beyond the screen.</div>
        <p class="card-body">
          Away from the computer, I recharge through volleyball, time outdoors, and training in the gym. I’m always
          on the lookout for new music and new experiences, and I value spending time with people who challenge me to
          grow and broaden my perspective.
        </p>
      </article>

      <article class="card card-quote card-accent">
        <div class="card-label">A guiding thought</div>
        <p class="big-quote">"Motivation forgives mistakes, hesitation charges interest."</p>
        <p class="quote-attr">A personal favourite</p>
      </article>

      <article class="card card-photo card-photo-placeholder">
        <img class="photoAltImg" :src="sequoiaPhoto" alt="Sequoia National Park" />
        <p class="photoCaption">Sequoia National Park June 2025</p>
      </article>

    </div>
  </section>
</template>

<script setup>
import momoPhoto from "../assets/momo.png";
import osakaCastlePhoto from "../assets/osaka-castle-steps.png";
import sequoiaPhoto from "../assets/sequoia-national-park.jpg";
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
  padding: 30px 30px 28px;
}

.heroTop {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  column-gap: 18px;
  align-items: start;
}

.heroCopy {
  min-width: 0;
  position: relative;
  z-index: 2;
  top: 0;
}

.card-approach {
  background:
    radial-gradient(circle at 92% 12%, color-mix(in srgb, var(--accent-main) 20%, transparent), transparent 38%),
    color-mix(in srgb, var(--card-base) 94%, var(--card-ice));
  border: 1px solid color-mix(in srgb, var(--accent-main) 22%, var(--border-soft));
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
  margin-bottom: 10px;
  font-weight: 500;
}

.hero-name {
  font-family: "Fraunces", Georgia, "Times New Roman", serif;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -2px;
  margin-bottom: 8px;
}

.hero-name em {
  font-style: normal;
  color: var(--accent-main);
}

.hero-role {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-weight: 300;
}

.hero-bio {
  font-size: 15px;
  line-height: 1.75;
  color: color-mix(in srgb, var(--text-ink) 80%, var(--text-muted));
  max-width: 64ch;
}

.hero-bio-lead {
  margin-bottom: 0;
}

.hero-bio-full {
  max-width: 72ch;
  margin-top: 10px;
}

.heroMedia {
  width: 250px;
  position: relative;
  margin: 46px 0 0;
  z-index: 2;
}

.heroPhoto {
  width: 100%;
  min-height: 320px;
  aspect-ratio: 4 / 5;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid color-mix(in srgb, var(--accent-main) 34%, var(--border-soft));
  background: color-mix(in srgb, var(--accent-main) 12%, var(--card-base));
  box-shadow: 0 18px 30px color-mix(in srgb, var(--accent-main) 20%, transparent);
}

.heroPhotoCaption {
  margin: 8px 4px 0;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text-muted) 84%, var(--text-ink));
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
  font-size: 12px;
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
  font-size: 30px;
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

.explore-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.explore-title {
  margin-bottom: 16px;
}

.explore-list li {
  position: relative;
  padding: 10px 12px 10px 34px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--accent-main) 26%, var(--border-soft));
  background: color-mix(in srgb, var(--accent-main) 9%, var(--card-base));
  color: color-mix(in srgb, var(--text-ink) 86%, var(--text-muted));
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

.explore-list li::before {
  content: "";
  position: absolute;
  left: 12px;
  top: 50%;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  transform: translateY(-50%);
  background: linear-gradient(145deg, var(--accent-main), var(--accent-2));
  box-shadow: 0 0 14px color-mix(in srgb, var(--accent-main) 35%, transparent);
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
  gap: 12px;
  margin-top: 18px;
}

.value-tag {
  padding: 9px 16px;
  background: color-mix(in srgb, var(--accent-main) 18%, var(--card-base));
  color: color-mix(in srgb, var(--accent-main) 72%, var(--text-ink));
  border-radius: 100px;
  font-size: 16px;
  font-weight: 650;
  line-height: 1;
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

.card-photo-main {
  display: flex;
  flex-direction: column;
}

.photoMainImg {
  min-height: 0;
  max-height: none;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  object-position: center;
  padding: 12px;
  background: color-mix(in srgb, var(--card-base) 92%, var(--bg-elev));
  transform: none;
}

.photoCaption {
  margin: 10px 4px 0;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text-muted) 84%, var(--text-ink));
}

.photoAltImg {
  object-position: center;
  transform: scale(1.07);
  transform-origin: center;
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
  gap: 8px;
}

.photoPlaceholder strong {
  font-size: 14px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.photoPlaceholder span {
  font-size: 12px;
  color: color-mix(in srgb, var(--text-ink) 68%, var(--text-muted));
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
    width: min(280px, 100%);
    margin: 0;
  }

  .heroTop {
    grid-template-columns: 1fr;
    row-gap: 10px;
  }

  .heroCopy {
    max-width: 100%;
  }

  .heroMedia {
    position: static;
  }

  .card-hero {
    padding-right: 24px;
  }
}
</style>
