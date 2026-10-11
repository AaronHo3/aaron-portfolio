<template>
  <article class="paper">
    <div class="paperTop">
      <span class="paperNum" aria-hidden="true">{{ String(position).padStart(2, "0") }}</span>
      <div class="paperMain">
        <h3 class="paperTitle">
          <a :href="paper.url" target="_blank" rel="noopener noreferrer">
            {{ paper.title }}<span class="visually-hidden"> (original paper, opens in a new tab)</span><span aria-hidden="true"> ↗</span>
          </a>
        </h3>
        <p class="meta byline">
          <span v-if="authors">{{ authors }} · </span>{{ paper.year }}<span v-if="paper.venue"> · {{ paper.venue }}</span>
        </p>
        <p class="statusLine">
          <span class="status" :data-status="paper.status">
            <component :is="statusIcon" :size="15" aria-hidden="true" />
            {{ STATUS_LABELS[paper.status] ?? paper.status }}
          </span>
          <span v-if="paper.sessionDate" class="meta">
            <time :datetime="paper.sessionDate">{{ weekdayOf(paper.sessionDate) }}, {{ formatDate(paper.sessionDate) }}</time>
            <span v-if="paper.sessionTime"> · {{ formatTime(paper.sessionTime) }}<span v-if="timeZoneLabel"> {{ timeZoneLabel }}</span></span>
          </span>
          <span v-if="topics" class="meta">{{ topics }}</span>
        </p>
        <p v-if="paper.question" class="question">{{ paper.question }}</p>
        <p v-if="paper.concept" class="meta concept"><strong>Core concept:</strong> {{ paper.concept }}</p>

        <details v-if="hasMore" class="more">
          <summary>Prerequisites, biology, and proposed exercise</summary>
          <dl>
            <div v-if="paper.prerequisites?.length">
              <dt>Helpful to know first</dt>
              <dd>
                <ul>
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
                <span class="note">A learning exercise proposed for the club, not an experiment from the paper.</span>
              </dd>
            </div>
          </dl>
        </details>

        <p v-if="paper.article || paper.codeUrl || paper.discussionUrl" class="links">
          <RouterLink v-if="paper.article" class="text-link" :to="postPath(paper.article.slug)">
            Read my notes <span class="arrow" aria-hidden="true">→</span>
          </RouterLink>
          <a v-if="paper.codeUrl" :href="paper.codeUrl" target="_blank" rel="noopener noreferrer">
            Code<span class="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
          <a v-if="paper.discussionUrl" :href="paper.discussionUrl" target="_blank" rel="noopener noreferrer">
            Discussion<span class="visually-hidden"> (opens in a new tab)</span> ↗
          </a>
        </p>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { CalendarClock, CircleCheck, CircleDashed, MessagesSquare } from "lucide-vue-next";
import { formatDate, formatTime, weekdayOf } from "../../lib/content/dates.js";
import { postPath } from "../../lib/content/urls.js";
import { STATUS_LABELS, shortAuthors, topicLabel } from "../../lib/content/labels.js";

const STATUS_ICONS = {
  backlog: CircleDashed,
  scheduled: CalendarClock,
  discussed: MessagesSquare,
  published: CircleCheck,
};

const props = defineProps({
  paper: { type: Object, required: true },
  /** 1-based display number, derived from the entry's place in roadmap.js */
  position: { type: Number, required: true },
  timeZoneLabel: { type: String, default: null },
});

const authors = computed(() => shortAuthors(props.paper.authors));
const topics = computed(() => (props.paper.topics ?? []).map(topicLabel).join(" · "));
const statusIcon = computed(() => STATUS_ICONS[props.paper.status] ?? CircleDashed);
const hasMore = computed(() => props.paper.prerequisites?.length || props.paper.bioConnection || props.paper.exercise);
</script>

<style scoped>
.paper {
  padding: var(--space-6) 0;
  border-bottom: var(--border);
}

.paperTop {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: var(--space-4);
}

.paperNum {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-accent);
}

.paperMain {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}

.paperTitle {
  font-size: clamp(1.1875rem, 1.1rem + 0.4vw, 1.375rem);
  overflow-wrap: anywhere;
}

.paperTitle a {
  color: var(--color-text);
  text-decoration: none;
}

.paperTitle a:hover {
  color: var(--color-accent);
  text-decoration: underline;
}

.statusLine {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-4);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.1rem 0.55rem;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  font-size: var(--fs-meta);
  font-weight: 700;
}

.status[data-status="scheduled"],
.status[data-status="published"] {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.question {
  margin-top: var(--space-2);
  max-width: var(--w-prose);
  font-size: 1.0625rem;
}

.concept {
  max-width: var(--w-prose);
}

.more {
  margin-top: var(--space-2);
  max-width: var(--w-prose);
}

.more summary {
  display: list-item; /* keeps the native disclosure triangle */
  padding-block: 0.6rem;
  color: var(--color-accent);
  font-size: var(--fs-small);
  font-weight: 650;
  cursor: pointer;
}

.more dl {
  display: grid;
  gap: var(--space-4);
  margin: var(--space-2) 0 0;
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: var(--border);
  border-radius: var(--radius-md);
}

.more dt {
  font-size: var(--fs-meta);
  font-weight: 700;
  color: var(--color-text-muted);
}

.more dd {
  margin: 2px 0 0;
  font-size: var(--fs-small);
}

.more ul {
  margin: 0;
  padding-left: 1.2em;
}

.note {
  display: block;
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-style: italic;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
  margin-top: var(--space-2);
  font-size: var(--fs-small);
  font-weight: 650;
}
</style>
