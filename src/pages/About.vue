<template>
  <section class="section about">
    <div class="intro card">
      <h1>About</h1>
      <p>
        I'm interested in building systems that turn data into useful understanding. My work sits at the intersection
        of machine learning, engineering, and healthcare.
      </p>
    </div>

    <section class="timeline" aria-label="About timeline">
      <article
        v-for="point in points"
        :key="point.id"
        class="card timelineNode"
        tabindex="0"
        :style="{ '--detail-max': point.id === '03' ? '760px' : '280px' }"
      >
        <div class="nodeHead">
          <span class="nodeNum">{{ point.id }}</span>
          <h2>{{ point.title }}</h2>
        </div>

        <div class="nodePreview">
          <figure class="miniShot">
            <img v-if="point.image" :src="point.image" :alt="point.imageAlt" />
            <div v-else class="miniPlaceholder">Add image</div>
          </figure>

          <div class="previewCopy">
            <p>{{ point.preview }}</p>
          </div>
        </div>

        <div class="nodeDetail">
          <p v-for="line in point.body" :key="line">{{ line }}</p>

          <div v-if="point.id === '03'" class="photoGrid">
            <figure class="photoSlot">
              <img :src="profileSrc" alt="Aaron working on a project" />
              <figcaption>A day in my element.</figcaption>
            </figure>
            <figure class="photoSlot">
              <div class="placeholder">Add photo</div>
              <figcaption>Hobby, trip, or new challenge.</figcaption>
            </figure>
            <figure class="photoSlot">
              <div class="placeholder">Add photo</div>
              <figcaption>Community or team moment.</figcaption>
            </figure>
          </div>
        </div>
      </article>
    </section>

    <p class="closing">Thanks for reading. If this resonates, I'd love to connect.</p>
  </section>
</template>

<script setup>
import profileSrc from "../assets/profile.jpg";

const points = [
  {
    id: "01",
    title: "How I Think",
    preview: "First-principles problem solving with practical execution.",
    body: [
      "I start with first principles before reaching for tools.",
      "Understanding the structure of the problem usually matters more than the specific model being used.",
    ],
    image: profileSrc,
    imageAlt: "Aaron planning project work",
  },
  {
    id: "02",
    title: "How I Work",
    preview: "Clear communication, ownership, and reliable collaboration.",
    body: [
      "I value reliability, ownership, and direct communication.",
      "My goal is to make work easy for teams to trust, understand, and build on.",
    ],
    image: null,
    imageAlt: "",
  },
  {
    id: "03",
    title: "Life Outside Work",
    preview: "The interests and people that keep me energized and curious.",
    body: [
      "Behind every project is a person who is curious about the world in more ways than one.",
      "When I'm not working on machine learning models or biomedical projects, I try to stay active, explore new ideas, and spend time with people who challenge me to grow.",
      "This is a small window into the things that keep me energized outside of work.",
    ],
    image: null,
    imageAlt: "",
  },
  {
    id: "04",
    title: "What I Value",
    preview: "Clarity, curiosity, and useful systems that improve over time.",
    body: [
      "Clear communication over jargon.",
      "Curiosity, humility, and continuous learning.",
      "Building useful things, then improving them with feedback.",
    ],
    image: null,
    imageAlt: "",
  },
];
</script>

<style scoped>
.about {
  display: grid;
  gap: 12px;
}

.intro {
  padding: 12px 14px;
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(24px, 3.1vw, 34px);
  letter-spacing: -0.03em;
}

.intro p {
  margin: 0;
  color: var(--muted);
  line-height: 1.62;
  font-size: 15px;
}

.timeline {
  position: relative;
  display: grid;
  gap: 10px;
  padding-left: 18px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: linear-gradient(var(--accent), color-mix(in srgb, var(--accent-2) 66%, var(--accent)));
  opacity: 0.5;
}

.timelineNode {
  position: relative;
  padding: 11px 12px;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.timelineNode::before {
  content: "";
  position: absolute;
  left: -14px;
  top: 20px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(140deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent);
}

.timelineNode:hover,
.timelineNode:focus-within {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--accent) 34%, var(--border));
  box-shadow: 0 16px 28px color-mix(in srgb, var(--accent) 13%, transparent);
}

.timelineNode:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent) 40%, transparent);
  outline-offset: 2px;
}

.nodeHead {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.nodeNum {
  font-family: "Sora", "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--muted);
}

h2 {
  margin: 0;
  letter-spacing: -0.02em;
  font-size: clamp(17px, 2.2vw, 19px);
}

.nodePreview {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.miniShot {
  margin: 0;
}

.miniShot img,
.miniPlaceholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.miniShot img {
  object-fit: cover;
}

.miniPlaceholder {
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  background: color-mix(in srgb, var(--card) 82%, var(--bg-elev));
  border-style: dashed;
}

.previewCopy p {
  margin: 0;
  color: var(--muted);
  line-height: 1.56;
  font-size: 14px;
}

.nodeDetail {
  margin-top: 10px;
  max-height: none;
  opacity: 1;
  overflow: visible;
  transform: none;
}

.nodeDetail p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.58;
  font-size: 14px;
}

.photoGrid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.photoSlot {
  margin: 0;
}

.photoSlot img,
.placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.photoSlot img {
  object-fit: cover;
}

.placeholder {
  display: grid;
  place-items: center;
  color: var(--muted);
  font-weight: 800;
  background: color-mix(in srgb, var(--card) 82%, var(--bg-elev));
  border-style: dashed;
}

figcaption {
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.closing {
  margin: 0;
  color: var(--muted);
  font-weight: 700;
  font-size: 14px;
}

@media (max-width: 900px) {
  .nodePreview {
    grid-template-columns: 64px 1fr;
    align-items: start;
  }

  .photoGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .timeline {
    padding-left: 14px;
  }

  .timeline::before {
    left: 5px;
  }

  .timelineNode::before {
    left: -11px;
    top: 18px;
    width: 7px;
    height: 7px;
  }

  .nodePreview {
    grid-template-columns: 56px 1fr;
    gap: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timelineNode {
    transition: none !important;
  }
}
</style>
