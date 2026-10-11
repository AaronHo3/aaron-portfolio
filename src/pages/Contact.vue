<template>
  <div class="container page contact">
    <header class="contactHead">
      <h1 class="page-title">Contact</h1>
      <p class="lead">
        For roles, collaborations, or project discussions, email is the fastest way to reach me. You can also connect on
        LinkedIn or GitHub.
      </p>
    </header>

    <section class="emailBlock" aria-labelledby="email-title">
      <h2 id="email-title" class="visually-hidden">Email</h2>
      <a class="emailLink" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
      <div class="emailActions">
        <a class="btn btn-primary" :href="`mailto:${profile.email}`">
          <Mail :size="18" aria-hidden="true" /> Email me
        </a>
        <button type="button" class="btn" @click="copyEmail">
          <Check v-if="copyState === 'copied'" :size="18" aria-hidden="true" />
          <Copy v-else :size="18" aria-hidden="true" />
          {{ copyState === "copied" ? "Copied" : "Copy email address" }}
        </button>
        <p class="copyStatus meta" role="status">{{ copyMessage }}</p>
      </div>
      <ul class="profiles">
        <li>
          <a :href="profile.links.linkedin" target="_blank" rel="noopener">
            LinkedIn<span class="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
        </li>
        <li>
          <a :href="profile.links.github" target="_blank" rel="noopener">
            GitHub<span class="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
        </li>
      </ul>
    </section>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { Check, Copy, Mail } from "lucide-vue-next";
import { profile } from "../data/profile.js";

const COPY_RESET_MS = 2500;

const copyState = ref("idle");
const copyMessage = ref("");
let copyTimer;

async function copyEmail() {
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText(profile.email);
    copyState.value = "copied";
    copyMessage.value = "Email address copied to the clipboard.";
  } catch {
    copyState.value = "idle";
    copyMessage.value = `Copy did not work in this browser. The address is ${profile.email}.`;
  }
  copyTimer = setTimeout(() => {
    copyState.value = "idle";
    copyMessage.value = "";
  }, COPY_RESET_MS);
}
</script>

<style scoped>
.contact {
  max-width: calc(var(--w-wide) + 2 * var(--gutter));
}

.contactHead .lead {
  margin-top: var(--space-4);
}

.emailBlock {
  margin-top: var(--space-7);
  padding: var(--space-6);
  background: var(--color-surface);
  border: var(--border);
  border-radius: var(--radius-lg);
}

.emailLink {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 1.1rem + 1.8vw, 2.5rem);
  font-weight: 600;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.emailLink:hover {
  text-decoration: underline;
}

.emailActions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.copyStatus {
  flex-basis: 100%;
  min-height: 1.5em;
}

.profiles {
  display: flex;
  gap: var(--space-5);
  margin: var(--space-3) 0 0;
  padding: var(--space-4) 0 0;
  border-top: var(--border);
  list-style: none;
}

.profiles a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-weight: 650;
}
</style>
