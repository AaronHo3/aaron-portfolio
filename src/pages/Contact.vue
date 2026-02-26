<template>
  <section class="card contactCard">
    <h2>Contact</h2>

    <div class="row">
      <a class="btn emailBtn" href="mailto:aaronho0218@gmail.com">
        <Mail class="icon" />
        <span>Email</span>
        <span class="ripple" aria-hidden="true"></span>
      </a>

      <a class="btn githubBtn" href="https://github.com/AaronHo3" target="_blank" rel="noreferrer">
        <Github class="icon" />
        <span>GitHub</span>
        <span class="ripple" aria-hidden="true"></span>
      </a>

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

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Icon follows text color */
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  transition: transform 160ms ease;
}

/* Subtle icon motion */
.btn:hover .icon {
  transform: translateX(2px);
}

/* Ripple layer */
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

/* Brand hover tints */
.emailBtn:hover { border-color: #ea4335; color: #ea4335; }
.githubBtn:hover { border-color: #333; color: #333; }
html[data-theme="dark"] .githubBtn:hover { border-color: #c9d1d9; color: #c9d1d9; }
.linkedinBtn:hover { border-color: #0a66c2; color: #0a66c2; }
</style>