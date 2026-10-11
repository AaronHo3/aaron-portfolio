<template>
  <article class="card paper">
    <div class="paperTop">
      <span class="paperNum" aria-hidden="true">{{ position }}</span>
      <div class="paperHeading">
        <h3 class="paperTitle">
          <a :href="paper.url" target="_blank" rel="noopener noreferrer">
            {{ paper.title }}<span class="srOnly"> (original paper, opens in a new tab)</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        </h3>
        <p class="paperByline">
          <span v-if="authors">{{ authors }} · </span>{{ paper.year }}<span v-if="paper.venue"> · {{ paper.venue }}</span>
        </p>
      </div>
      <span class="paperStatus" :data-status="paper.status">{{ STATUS_LABELS[paper.status] ?? paper.status }}</span>
    </div>

    <p v-if="paper.sessionDate" class="paperSession">
      Session:
      <time :datetime="paper.sessionDate">{{ weekdayOf(paper.sessionDate) }}, {{ formatDate(paper.sessionDate) }}</time>
      <span v-if="paper.sessionTime"> · {{ formatTime(paper.sessionTime) }}<span v-if="timeZoneLabel"> {{ timeZoneLabel }}</span></span>
    </p>

    <dl class="paperFacts">
      <div v-if="paper.question">
        <dt>Learning question</dt>
        <dd>{{ paper.question }}</dd>
      </div>
      <div v-if="paper.concept">
        <dt>Core concept</dt>
        <dd>{{ paper.concept }}</dd>
      </div>
    </dl>

    <details v-if="hasMore" class="paperMore">
      <summary>Prerequisites, biology, and proposed exercise</summary>
      <dl class="paperFacts">
        <div v-if="paper.prerequisites?.length">
          <dt>Helpful to know first</dt>
          <dd>
            <ul class="prereqs">
              <li v-for="item in paper.prerequisites" :key="item">{{ item }}</li>
            </ul>
          </dd>
        </div>
        <div v-if="paper.bioConnection">
          <dt>Biological connection</dt>
          <dd>{{ paper.bioConnection }}</dd>
        </div>
        <div v-if="paper.exercise">
          <dt>Proposed exercise</dt>
          <dd>
            {{ paper.exercise }}
            <span class="exerciseNote">A learning exercise proposed for the club, not an experiment from the paper.</span>
          </dd>
        </div>
      </dl>
    </details>

    <div class="paperFoot">
      <ul v-if="paper.topics?.length" class="blogTags" aria-label="Topics">
        <li v-for="t in paper.topics" :key="t"><span class="blogTag">{{ topicLabel(t) }}</span></li>
      </ul>
      <div v-if="paper.article || paper.codeUrl || paper.discussionUrl" class="paperLinks">
        <RouterLink v-if="paper.article" class="btn small" :to="postPath(paper.article.slug)">Read the write-up</RouterLink>
        <a v-if="paper.codeUrl" class="btn small" :href="paper.codeUrl" target="_blank" rel="noopener noreferrer">
          Code<span class="srOnly"> (opens in a new tab)</span> ↗
        </a>
        <a v-if="paper.discussionUrl" class="btn small" :href="paper.discussionUrl" target="_blank" rel="noopener noreferrer">
          Discussion<span class="srOnly"> (opens in a new tab)</span> ↗
        </a>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { formatDate, formatTime, weekdayOf } from "../../lib/content/dates.js";
import { postPath } from "../../lib/content/urls.js";
import { STATUS_LABELS, shortAuthors, topicLabel } from "../../lib/content/labels.js";

const props = defineProps({
  paper: { type: Object, required: true },
  /** 1-based display number, derived from the entry's place in roadmap.js */
  position: { type: Number, required: true },
  timeZoneLabel: { type: String, default: null },
});

const authors = computed(() => shortAuthors(props.paper.authors));
const hasMore = computed(
  () => props.paper.prerequisites?.length || props.paper.bioConnection || props.paper.exercise,
);
</script>

<style scoped>
.paper {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.paperTop {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: start;
}

.paperNum {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  font-family: "Fraunces", Georgia, serif;
  font-weight: 800;
  color: color-mix(in srgb, #0f172a 80%, white);
  background: linear-gradient(140deg, var(--accent), var(--accent-2));
}

.paperTitle {
  margin: 0;
  font-size: clamp(18px, 1.7vw, 21px);
  letter-spacing: -0.015em;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.paperTitle a {
  color: var(--text);
  text-decoration: none;
}

.paperTitle a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.paperByline {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.paperStatus {
  border-radius: var(--r-pill);
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 850;
  border: 1px solid var(--border);
  color: var(--muted);
  white-space: nowrap;
}
.paperStatus[data-status="scheduled"] {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
  background: color-mix(in srgb, var(--accent) 16%, transparent);
}
.paperStatus[data-status="discussed"],
.paperStatus[data-status="published"] {
  color: var(--text);
  border-color: color-mix(in srgb, #10b981 60%, var(--border));
  background: color-mix(in srgb, #10b981 14%, transparent);
}

.paperSession {
  margin: 0;
  font-weight: 800;
  font-size: 14px;
  color: var(--accent);
}

.paperFacts {
  margin: 0;
  display: grid;
  gap: 10px;
}
.paperFacts dt {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.paperFacts dd {
  margin: 3px 0 0;
  line-height: 1.6;
}

.prereqs {
  margin: 0;
  padding-left: 18px;
}

.exerciseNote {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
  font-style: italic;
}

.paperMore {
  border-top: 1px solid var(--border);
  padding-top: 12px;
}
.paperMore summary {
  cursor: pointer;
  font-weight: 850;
  font-size: 14px;
  color: var(--muted);
  width: fit-content;
}
.paperMore summary:hover {
  color: var(--text);
}
.paperMore[open] summary {
  margin-bottom: 12px;
  color: var(--text);
}

.paperFoot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.paperLinks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn.small {
  padding: 8px 12px;
  font-size: 13px;
}

@media (max-width: 560px) {
  .paperTop {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .paperStatus {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
