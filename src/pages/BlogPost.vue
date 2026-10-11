<template>
  <div class="container page">
    <p v-if="status === 'loading'" class="meta" aria-live="polite">Loading article…</p>

    <div v-else-if="meta && body" class="articleLayout" :class="{ withToc: hasToc }">
      <article class="article">
        <header class="articleHead">
          <RouterLink class="backLink" to="/blog">← All writing</RouterLink>
          <p v-if="series" class="seriesLine">
            <RouterLink v-if="series.path" class="seriesLabel" :to="series.path">{{ series.label }}</RouterLink>
            <span v-else class="seriesLabel">{{ series.label }}</span>
          </p>
          <h1 class="articleTitle">{{ meta.title }}</h1>
          <p class="lead articleDesc">{{ meta.description }}</p>
          <p class="meta articleMeta">
            <span>Published <time :datetime="meta.date">{{ formatDate(meta.date) }}</time></span>
            <span v-if="meta.updated">
              <span aria-hidden="true"> · </span>Updated <time :datetime="meta.updated">{{ formatDate(meta.updated) }}</time>
            </span>
            <span aria-hidden="true"> · </span><span>{{ meta.readingMinutes }} min read</span>
          </p>
          <ul v-if="meta.tags.length" class="tag-list" aria-label="Topics">
            <li v-for="tag in meta.tags" :key="tag">
              <RouterLink class="tag" :to="{ path: '/blog', query: { topic: tag } }">{{ topicLabel(tag) }}</RouterLink>
            </li>
          </ul>
          <p v-if="meta.state !== 'published'" class="notice stateNotice" role="note">
            <strong>{{ meta.state === "draft" ? "Draft" : "Scheduled" }} preview.</strong>
            {{
              meta.state === "draft"
                ? "This article has draft: true. It is visible only on the local dev server and is not part of production builds."
                : `This article is dated ${formatDate(meta.date)}. It will be included in the first production build on or after that date.`
            }}
          </p>
        </header>

        <aside v-if="paper || meta.codeUrl || meta.discussionUrl" class="resources" aria-label="Paper and resources">
          <div v-if="paper">
            <p class="meta resourceLabel">Paper discussed</p>
            <p class="resourceTitle">
              <a v-if="paper.url" :href="paper.url" target="_blank" rel="noopener noreferrer">
                {{ paper.title }}<span class="visually-hidden"> (original paper, opens in a new tab)</span><span aria-hidden="true"> ↗</span>
              </a>
              <span v-else>{{ paper.title }}</span>
            </p>
            <p v-if="paper.authors || paper.year" class="meta">{{ [paper.authors, paper.year].filter(Boolean).join(" · ") }}</p>
          </div>
          <div v-if="meta.codeUrl || meta.discussionUrl" class="resourceLinks">
            <a v-if="meta.codeUrl" class="btn btn-sm" :href="meta.codeUrl" target="_blank" rel="noopener noreferrer">
              Code / notebook<span class="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
            <a v-if="meta.discussionUrl" class="btn btn-sm" :href="meta.discussionUrl" target="_blank" rel="noopener noreferrer">
              Discussion<span class="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          </div>
          <p v-if="previewMode && meta.paperId && paper && !paper.inRoadmap" class="meta authorNote">
            Preview note: paperId "{{ meta.paperId }}" is not in the roadmap, so the article's own paper fields are shown.
          </p>
        </aside>

        <details v-if="hasToc" class="tocInline">
          <summary>On this page</summary>
          <TocList :toc="body.toc" />
        </details>

        <div class="prose" v-html="body.html" @click="onProseClick"></div>

        <footer class="articleFoot">
          <section v-if="related.length" aria-labelledby="related-heading">
            <h2 id="related-heading" class="relatedTitle">Related writing</h2>
            <ul class="relatedList">
              <li v-for="p in related" :key="p.slug">
                <PostListItem :post="p" :heading-level="3" />
              </li>
            </ul>
          </section>
          <RouterLink class="backLink" to="/blog">← Back to all writing</RouterLink>
        </footer>
      </article>

      <nav v-if="hasToc" class="tocAside" aria-label="Table of contents">
        <p class="meta tocHeading">On this page</p>
        <TocList :toc="body.toc" />
      </nav>
    </div>

    <div v-else class="notFound">
      <h1 class="page-title">Article not found</h1>
      <p class="lead">It may have moved or not been published yet.</p>
      <RouterLink class="btn" to="/blog">Browse all writing</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, nextTick, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import "katex/dist/katex.min.css";
import "../styles/blog.css";
import "../styles/prose.css";

import PostListItem from "../components/blog/PostListItem.vue";
import { loadPost, posts, previewMode } from "../lib/content/blog.js";
import { formatDate } from "../lib/content/dates.js";
import { relatedPosts } from "../lib/content/posts.js";
import { resolvePaperForPost } from "../lib/content/roadmap.js";
import { seriesInfo, topicLabel } from "../lib/content/labels.js";
import { absoluteUrl, postPath } from "../lib/content/urls.js";
import { papers } from "../content/reading-club/roadmap.js";
import { site } from "../content/site.config.js";
import { usePageHead } from "../lib/head.js";

/** Minimum number of h2/h3 headings before a table of contents is shown. */
const TOC_MIN_HEADINGS = 3;
/** Matches the router's anchor offset (sticky header height + 16px). */
const ANCHOR_OFFSET = 80;

const TocList = defineComponent({
  props: { toc: { type: Array, required: true } },
  setup(props) {
    return () =>
      h(
        "ol",
        { class: "tocList" },
        props.toc.map((item) =>
          h("li", { key: item.id, class: `toc-h${item.level}` }, [
            h(RouterLink, { to: { hash: `#${item.id}` } }, () => item.text),
          ]),
        ),
      );
  },
});

const route = useRoute();
const router = useRouter();

const status = ref("loading");
const body = ref(null);

const meta = computed(() => posts.find((p) => p.slug === route.params.slug) ?? null);
const series = computed(() => seriesInfo(meta.value?.series));
const paper = computed(() => (meta.value ? resolvePaperForPost(meta.value, papers) : null));
const related = computed(() => (meta.value ? relatedPosts(meta.value, posts) : []));
const hasToc = computed(() => (body.value?.toc.length ?? 0) >= TOC_MIN_HEADINGS);

async function load(slug) {
  status.value = "loading";
  body.value = null;
  let result = null;
  try {
    result = await loadPost(slug);
  } catch (err) {
    console.error(`[blog] failed to load article "${slug}"`, err);
  }
  // A newer navigation started while this chunk loaded; drop the stale result.
  if (route.params.slug !== slug) return;
  body.value = result;
  status.value = "ready";
  if (route.hash) {
    await nextTick();
    scrollToHash(route.hash);
  }
}

function scrollToHash(hash) {
  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return; // malformed percent-encoding in a hand-typed URL
  }
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET });
}

watch(() => route.params.slug, (slug) => slug && load(slug), { immediate: true });

/** Keep in-article links inside the SPA (hash routing) instead of reloading. */
function onProseClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  const href = event.target.closest?.("a")?.getAttribute("href") ?? "";
  if (href.startsWith("#") && !href.startsWith("#/")) {
    event.preventDefault();
    router.push({ hash: href });
  } else if (href.startsWith("/#/")) {
    event.preventDefault();
    router.push(href.slice(2));
  }
}

usePageHead(() => {
  if (status.value === "loading") return null;
  if (!meta.value || !body.value) return { title: `Not found | ${site.title}`, noindex: true };
  return {
    title: `${meta.value.title} | ${site.title}`,
    description: meta.value.description,
    canonical: absoluteUrl(postPath(meta.value.slug)),
    type: "article",
    publishedTime: meta.value.date,
    modifiedTime: meta.value.updated ?? undefined,
    tags: meta.value.tags,
    noindex: meta.value.state !== "published",
  };
});
</script>

<style scoped>
.articleLayout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-7);
}

.articleLayout.withToc {
  grid-template-columns: minmax(0, 1fr) 220px;
}

.article {
  min-width: 0;
  max-width: calc(var(--w-prose) + 4ch);
}

.seriesLine {
  margin-top: var(--space-4);
}

.articleTitle {
  margin-top: var(--space-2);
  font-size: var(--fs-h1);
  overflow-wrap: anywhere;
}

.articleDesc {
  margin-top: var(--space-4);
}

.articleMeta {
  margin: var(--space-4) 0 var(--space-3);
}

.stateNotice {
  margin-top: var(--space-5);
}

.resources {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-6) 0;
  padding: var(--space-4) 0 var(--space-4) var(--space-5);
  border-left: 3px solid var(--color-accent);
}

.resourceLabel {
  font-weight: 700;
}

.resourceTitle {
  font-weight: 700;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.resourceTitle a {
  color: var(--color-text);
}

.resourceTitle a:hover {
  color: var(--color-accent);
}

.resourceLinks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.prose {
  margin-top: var(--space-6);
}

.tocAside {
  position: sticky;
  top: calc(var(--header-h) + var(--space-5));
  align-self: start;
  max-height: calc(100vh - var(--header-h) - 48px);
  overflow-y: auto;
}

.tocHeading {
  margin-bottom: var(--space-3);
  font-weight: 700;
}

.tocInline {
  display: none;
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-4);
  border: var(--border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.tocInline summary {
  min-height: 32px;
  font-weight: 650;
  cursor: pointer;
}

:deep(.tocList) {
  display: grid;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: var(--border);
}

:deep(.tocList a) {
  display: block;
  padding: var(--space-1) var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--fs-small);
  text-decoration: none;
}

:deep(.tocList a:hover) {
  color: var(--color-accent);
}

:deep(.tocList .toc-h3 a) {
  padding-left: var(--space-5);
  font-size: var(--fs-meta);
}

.articleFoot {
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  border-top: var(--border);
}

.relatedTitle {
  font-size: var(--fs-h3);
}

.relatedList {
  margin: 0 0 var(--space-5);
  padding: 0;
  list-style: none;
}

.notFound .lead {
  margin: var(--space-4) 0 var(--space-5);
}

@media (max-width: 1100px) {
  .articleLayout.withToc {
    grid-template-columns: minmax(0, 1fr);
  }
  .tocAside {
    display: none;
  }
  .tocInline {
    display: block;
  }
}
</style>
