<template>
  <section class="section about">
    <div class="intro card">
      <div class="introCopy">
        <p class="eyebrow">Story</p>
        <h1>The person behind the work.</h1>
        <p class="lead">
          I care about thoughtful work, clear communication, and being someone people genuinely enjoy collaborating
          with.
        </p>
        <p>
          This page is the human side of my portfolio: how I think, what keeps me curious, and what I value when
          building with teams.
        </p>
      </div>

      <figure class="portrait">
        <img :src="profileSrc" alt="Portrait of Aaron Ho" />
      </figure>
    </div>

    <section ref="storylineRef" class="storyline" :class="{ drawn: timelineDrawn }">
      <article :ref="setStepRef" class="card storyStep">
        <span class="stepDot" aria-hidden="true"></span>
        <p class="stepMeta">Chapter 1</p>
        <h2>How I Approach Problems</h2>
        <p>
          I start with first principles and keep things practical. I like asking the right questions early, listening
          closely, and making tradeoffs explicit so teams can move with confidence.
        </p>
      </article>

      <article :ref="setStepRef" class="card storyStep">
        <span class="stepDot" aria-hidden="true"></span>
        <p class="stepMeta">Chapter 2</p>
        <h2>How I Work With People</h2>
        <p>
          I value reliability, ownership, and clear communication. My goal is not just strong outputs, but work that
          people can trust, understand, and build on.
        </p>
      </article>

      <article :ref="setStepRef" class="card storyStep photoStep">
        <span class="stepDot" aria-hidden="true"></span>
        <p class="stepMeta">Chapter 3</p>
        <h2>What Keeps Me Curious</h2>
        <p class="photoCopy">These slots are for personality: interests, hobbies, and moments outside work.</p>
        <div class="photoGrid">
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
      </article>

      <article :ref="setStepRef" class="card storyStep">
        <span class="stepDot" aria-hidden="true"></span>
        <p class="stepMeta">Chapter 4</p>
        <h2>What I Value</h2>
        <ul class="list">
          <li>Clear communication over flashy jargon</li>
          <li>Curiosity, humility, and continuous learning</li>
          <li>Building useful things, then improving them with feedback</li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import profileSrc from "../assets/profile.jpg";

const stepRefs = ref([]);
const storylineRef = ref(null);
const timelineDrawn = ref(false);
let stepObserver;
let timelineObserver;

function setStepRef(el) {
  if (!el || stepRefs.value.includes(el)) return;
  stepRefs.value.push(el);
}

onMounted(() => {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    timelineDrawn.value = true;
    for (const el of stepRefs.value) el.classList.add("in");
    return;
  }

  stepObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        stepObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -30px 0px" },
  );

  stepRefs.value.forEach((el) => stepObserver.observe(el));

  if (storylineRef.value) {
    timelineObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        timelineDrawn.value = true;
        timelineObserver?.disconnect();
      },
      { threshold: 0.14 },
    );
    timelineObserver.observe(storylineRef.value);
  }
});

onBeforeUnmount(() => {
  stepObserver?.disconnect();
  timelineObserver?.disconnect();
});
</script>

<style scoped>
.about {
  display: grid;
  gap: 16px;
}

.intro {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  align-items: center;
}

.eyebrow {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 8px 0 10px;
  font-size: clamp(28px, 4vw, 42px);
  letter-spacing: -0.03em;
}

h2 {
  margin: 6px 0 10px;
  letter-spacing: -0.02em;
}

.lead,
p {
  margin: 0;
  color: var(--muted);
  line-height: 1.72;
}

.portrait {
  margin: 0;
  justify-self: center;
  padding-left: 12px;
}

.portrait img {
  width: min(100%, 260px);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.storyline {
  position: relative;
  display: grid;
  gap: 14px;
  padding-left: 20px;
}

.storyline::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: linear-gradient(var(--accent), color-mix(in srgb, var(--accent-2) 60%, var(--accent)));
  opacity: 0.45;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 920ms cubic-bezier(0.2, 0.9, 0.2, 1);
}

.storyline.drawn::before {
  transform: scaleY(1);
}

.storyStep {
  position: relative;
  opacity: 0;
  transform: translateX(-20px);
  filter: blur(6px);
  transition:
    opacity 520ms ease,
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    filter 520ms ease;
}

.storyStep:nth-child(even) {
  transform: translateX(20px);
}

.storyStep.in {
  opacity: 1;
  transform: translateX(0);
  filter: blur(0);
}

.stepDot {
  position: absolute;
  left: -24px;
  top: 18px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(140deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
}

.stepMeta {
  color: var(--muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.photoCopy {
  margin-bottom: 10px;
}

.photoGrid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
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
  margin-top: 8px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.list {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.72;
}

@media (max-width: 900px) {
  .intro,
  .photoGrid {
    grid-template-columns: 1fr;
  }

  .portrait {
    justify-self: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .storyline::before {
    transform: scaleY(1);
    transition: none;
  }

  .storyStep {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
</style>
