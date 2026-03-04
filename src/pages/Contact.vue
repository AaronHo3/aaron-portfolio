<template>
  <section class="section contactSection">
    <div class="card contactIntro">
      <h2>Let’s Connect</h2>
      <p>
        For roles, collaborations, or project discussions, email is the fastest way to reach me. You can also connect on LinkedIn or GitHub.
      </p>
      <p class="emailLine">aaronho0218@gmail.com</p>

      <div class="row">
        <a class="btn emailBtn" href="mailto:aaronho0218@gmail.com">
          <Mail class="icon" />
          <span>Email</span>
        </a>

        <a class="btn githubBtn" href="https://github.com/AaronHo3" target="_blank" rel="noreferrer">
          <Github class="icon" />
          <span>GitHub</span>
        </a>

        <a class="btn linkedinBtn" href="https://www.linkedin.com/in/aaronho3/" target="_blank" rel="noreferrer">
          <Linkedin class="icon" />
          <span>LinkedIn</span>
        </a>
      </div>
    </div>

    <form class="card contactForm" @submit.prevent="sendViaEmail">
      <h3>Send a Message</h3>

      <label class="field">
        <span>Name</span>
        <input v-model.trim="name" class="input" type="text" placeholder="Your name" />
      </label>

      <label class="field">
        <span>Email</span>
        <input v-model.trim="email" class="input" type="email" placeholder="you@example.com" />
      </label>

      <label class="field">
        <span>Message</span>
        <textarea v-model.trim="message" class="input messageInput" rows="5" placeholder="What are you reaching out about?" />
      </label>

      <button class="btn sendBtn" type="submit">Send via Email</button>
    </form>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { Mail, Github, Linkedin } from "lucide-vue-next";

const name = ref("");
const email = ref("");
const message = ref("");

const mailHref = computed(() => {
  const subject = name.value ? `Portfolio inquiry from ${name.value}` : "Portfolio inquiry";
  const body = [
    name.value ? `Name: ${name.value}` : "",
    email.value ? `Email: ${email.value}` : "",
    "",
    message.value || "",
  ].filter(Boolean).join("\n");

  return `mailto:aaronho0218@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

function sendViaEmail() {
  window.location.href = mailHref.value;
}
</script>

<style scoped>
.contactSection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

h2, h3 {
  margin: 0 0 10px;
}

p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.emailLine {
  margin-top: 10px;
  font-weight: 800;
  color: var(--text);
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.field {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.field span {
  font-size: 13px;
  color: var(--muted);
  font-weight: 800;
}

.messageInput {
  resize: vertical;
  min-height: 120px;
}

.sendBtn {
  margin-top: 14px;
}

.emailBtn:hover { border-color: #ea4335; color: #ea4335; }
.githubBtn:hover { border-color: #333; color: #333; }
html[data-theme="dark"] .githubBtn:hover { border-color: #c9d1d9; color: #c9d1d9; }
.linkedinBtn:hover { border-color: #0a66c2; color: #0a66c2; }

@media (max-width: 900px) {
  .contactSection {
    grid-template-columns: 1fr;
  }
}
</style>
