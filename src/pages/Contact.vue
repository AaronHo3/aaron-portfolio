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

    <section class="draft" aria-labelledby="draft-title">
      <h2 id="draft-title" class="draftTitle">Write a draft here</h2>
      <p class="muted draftNote">
        This form does not send anything on its own. It opens a pre-filled draft in your email app, and you send it from
        there. If you use webmail and nothing opens, copy the address above instead.
      </p>

      <form class="draftForm" novalidate @submit.prevent="openDraft">
        <div class="field">
          <label for="c-name">Your name <span class="optional">(optional)</span></label>
          <input id="c-name" v-model.trim="name" class="input" type="text" autocomplete="name" />
        </div>
        <div class="field">
          <label for="c-email">Your email <span class="optional">(optional)</span></label>
          <input
            id="c-email"
            v-model.trim="email"
            class="input"
            type="email"
            autocomplete="email"
            :aria-invalid="emailError ? 'true' : undefined"
            :aria-describedby="emailError ? 'c-email-error' : undefined"
          />
          <p v-if="emailError" id="c-email-error" class="fieldError">{{ emailError }}</p>
        </div>
        <div class="field">
          <label for="c-message">Message</label>
          <textarea
            id="c-message"
            v-model.trim="message"
            class="input"
            rows="6"
            required
            :aria-invalid="messageError ? 'true' : undefined"
            :aria-describedby="messageError ? 'c-message-error' : undefined"
          ></textarea>
          <p v-if="messageError" id="c-message-error" class="fieldError">{{ messageError }}</p>
        </div>
        <div class="formActions">
          <button class="btn btn-primary" type="submit">Open email draft</button>
          <p v-if="draftOpened" class="meta" role="status">
            Your email app should now show the draft. Nothing is sent until you press send there.
          </p>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Check, Copy, Mail } from "lucide-vue-next";
import { profile } from "../data/profile.js";
import { buildMailto, isPlausibleEmail } from "../lib/mailto.js";

const COPY_RESET_MS = 2500;

const name = ref("");
const email = ref("");
const message = ref("");
const emailError = ref("");
const messageError = ref("");
const draftOpened = ref(false);

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

function openDraft() {
  emailError.value = email.value && !isPlausibleEmail(email.value) ? "Check this address, or leave it empty." : "";
  messageError.value = message.value ? "" : "Write a short message first.";
  if (emailError.value || messageError.value) {
    document.getElementById(messageError.value && !emailError.value ? "c-message" : "c-email")?.focus();
    return;
  }
  window.location.href = buildMailto(profile.email, {
    name: name.value,
    email: email.value,
    message: message.value,
  });
  draftOpened.value = true;
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

.draft {
  margin-top: var(--space-8);
  max-width: 640px;
}

.draftTitle {
  font-size: var(--fs-h3);
}

.draftNote {
  margin-top: var(--space-2);
}

.draftForm {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-5);
}

.field {
  display: grid;
  gap: var(--space-2);
}

.field label {
  font-weight: 650;
  font-size: var(--fs-small);
}

.optional {
  font-weight: 400;
  color: var(--color-text-muted);
}

textarea.input {
  resize: vertical;
  min-height: 140px;
}

.fieldError {
  font-size: var(--fs-small);
  font-weight: 600;
  color: #b3261e;
}

:global(html[data-theme="dark"] .fieldError) {
  color: #f2b8b5;
}

.formActions {
  display: grid;
  gap: var(--space-3);
  justify-items: start;
}
</style>
