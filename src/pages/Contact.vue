<template>
  <section class="card contactCard">
    <h2>Contact</h2>

    <div class="row">
      <!-- Email -->
      <a class="btn emailBtn" href="mailto:aaronho0218@gmail.com">
        <Mail class="icon" />
        <span>Email</span>
        <span class="ripple" aria-hidden="true"></span>
      </a>

      <!-- GitHub -->
      <a class="btn githubBtn" href="https://github.com/AaronHo3" target="_blank" rel="noreferrer">
        <Github class="icon" />
        <span>GitHub</span>
        <span class="ripple" aria-hidden="true"></span>
      </a>

      <!-- LinkedIn -->
      <a class="btn linkedinBtn" href="https://www.linkedin.com/in/aaronho3/" target="_blank" rel="noreferrer">
        <Linkedin class="icon" />
        <span>LinkedIn</span>
        <span class="ripple" aria-hidden="true"></span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { Mail, Github, Linkedin } from "lucide-vue-next";
</script>

<style scoped>
h2 { margin: 0 0 12px; }

.contactCard { max-width: 560px; }

/* Layout */
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Base button — matches your clean navbar/button vibe */
.btn {
  position: relative;
  overflow: hidden;             /* needed for ripple */
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;         /* pill like navbar */
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-weight: 850;
  text-decoration: none;
  line-height: 1;

  transform: translateZ(0);     /* smoother animations */
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

/* Icon follows text color */
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  transition: transform 160ms ease;
}

/* Lift + shadow */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Subtle icon motion */
.btn:hover .icon {
  transform: translateX(2px);
}

/* Soft ripple (no JS) */
.ripple {
  position: absolute;
  inset: -60%;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 200ms ease, transform 200ms ease;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, currentColor 22%, transparent),
    transparent 65%
  );
}

.btn:hover .ripple {
  opacity: 1;
  transform: scale(1);
}

/* Slight press feedback */
.btn:active {
  transform: translateY(-1px) scale(0.98);
}

/* ========= Brand hover tints (color + border) ========= */
.emailBtn:hover {
  border-color: #ea4335;
  color: #ea4335;
}

.githubBtn:hover {
  border-color: #333;
  color: #333;
}

/* GitHub in dark mode: use a lighter gray */
html[data-theme="dark"] .githubBtn:hover {
  border-color: #c9d1d9;
  color: #c9d1d9;
}

.linkedinBtn:hover {
  border-color: #0a66c2;
  color: #0a66c2;
}

/* Optional: accessibility focus ring */
.btn:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--text) 25%, transparent);
  outline-offset: 3px;
}
</style>