<template>
  <section class="section blogScope">
    <p v-if="status === 'loading'" class="loading" aria-live="polite">Loading article…</p>

    <div v-else-if="meta && body" class="articleLayout" :class="{ withToc: hasToc }">
      <article class="article">
        <header class="articleHead">
          <RouterLink class="blogBackLink" to="/blog">← All posts</RouterLink>

          <p v-if="series" class="seriesLine">
            <RouterLink v-if="series.path" class="blogSeriesBadge" :to="series.path">{{ series.label }}</RouterLink>
            <span v-else class="blogSeriesBadge">{{ series.label }}</span>
          </p>

          <h1 class="articleTitle">{{ meta.title }}</h1>
          <p class="articleDesc">{{ meta.description }}</p>

          <p class="articleMeta">
            <span>Published <time :datetime="meta.date">{{ formatDate(meta.date) }}</time></span>
            <span v-if="meta.updated">
              <span aria-hidden="true"> · </span>Updated <time :datetime="meta.updated">{{ formatDate(meta.updated) }}</time>
            </span>
            <span aria-hidden="true"> · </span><span>{{ meta.readingMinutes }} min read</span>
          </p>

          <ul v-if="meta.tags.length" class="blogTags" aria-label="Topics">
            <li v-for="tag in meta.tags" :key="tag">
              <RouterLink class="blogTag" :to="{ path: '/blog', query: { topic: tag } }">{{ topicLabel(tag) }}</RouterLink>
            </li>
          </ul>

          <div v-if="meta.state !== 'published'" class="blogNotice" role="note">
            <strong>{{ meta.state === "draft" ? "Draft" : "Scheduled" }} preview.</strong>
            {{
              meta.state === "draft"
                ? "This article has draft: true. It is visible only on the local dev server and is not part of production builds."
                : `This article is dated ${formatDate(meta.date)}. It will be included in the first production build on or after that date.`
            }}
          </div>
        </header>

        <aside v-if="paper || meta.codeUrl || meta.discussionUrl" class="card resources" aria-label="Paper and resources">
          <div v-if="paper" class="resourcePaper">
            <p class="resourceLabel">Paper</p>
            <p class="resourceTitle">
              <a v-if="paper.url" :href="paper.url" target="_blank" rel="noopener noreferrer">
                {{ paper.title }}<span class="srOnly"> (original paper, opens in a new tab)</span><span aria-hidden="true"> ↗</span>
              </a>
              <span v-else>{{ paper.title }}</span>
            </p>
            <p v-if="paper.authors || paper.year" class="resourceByline">
              {{ [paper.authors, paper.year].filter(Boolean).join(" · ") }}
            </p>
          </div>
          <div v-if="meta.codeUrl || meta.discussionUrl" class="resourceLinks">
            <a v-if="meta.codeUrl" class="btn" :href="meta.codeUrl" target="_blank" rel="noopener noreferrer">
              Code / notebook<span class="srOnly"> (opens in a new tab)</span> ↗
            </a>
            <a v-if="meta.discussionUrl" class="btn" :href="meta.discussionUrl" target="_blank" rel="noopener noreferrer">
              Discussion<span class="srOnly"> (opens in a new tab)</span> ↗
            </a>
          </div>
          <p v-if="previewMode && meta.paperId && paper && !paper.inRoadmap" class="authorNote">
            Preview note: paperId "{{ meta.paperId }}" is not in the roadmap, so the article's own paper fields are shown.
          </p>
        </aside>

        <details v-if="hasToc" class="tocInline">
          <summary>On this page</summary>
          <TocList :toc="body.toc" />
        </details>

        <div class="prose" v-html="body.html" @click="onProseClick"></div>

        <footer class="articleFoot">
          <section v-if="related.length" aria-labelledby="relatedHeading">
            <h2 id="relatedHeading" class="relatedTitle">Related posts</h2>
            <ul class="relatedList">
              <li v-for="p in related" :key="p.slug">
                <PostListItem :post="p" :heading-level="3" />
              </li>
            </ul>
          </section>
          <RouterLink class="blogBackLink" to="/blog">← Back to all posts</RouterLink>
        </footer>
      </article>

      <nav v-if="hasToc" class="tocAside" aria-label="Table of contents">
        <p class="tocHeading">On this page</p>
        <TocList :toc="body.toc" />
      </nav>
    </div>

    <div v-else class="card blogEmpty notFound">
      <h1 class="notFoundTitle">Article not found</h1>
      <p>It may have moved or not been published yet.</p>
      <p><RouterLink class="btn" to="/blog">Browse all posts</RouterLink></p>
    </div>
  </section>
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
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96 });
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
.loading {
  color: var(--muted);
  font-weight: 800;
}

.articleLayout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5);
  max-width: 1120px;
  margin: 0 auto;
}

.articleLayout.withToc {
  grid-template-columns: minmax(0, 1fr) 230px;
}

.article {
  min-width: 0;
  max-width: 74ch;
}

.seriesLine {
  margin: 0 0 12px;
}

.articleTitle {
  margin: 0;
  font-size: clamp(30px, 4vw, 48px);
  letter-spacing: -0.03em;
  line-height: 1.08;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.articleDesc {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 1.12em;
  line-height: 1.6;
}

.articleMeta {
  margin: 16px 0 12px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 800;
}

.resources {
  margin: var(--space-4) 0;
  padding: var(--space-3) var(--space-4);
  display: grid;
  gap: 12px;
}
.resourceLabel {
  margin: 0;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.resourceTitle {
  margin: 4px 0 0;
  font-weight: 850;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
.resourceTitle a {
  color: var(--text);
  text-decoration: none;
}
.resourceTitle a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.resourceByline {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
}
.resourceLinks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.authorNote {
  margin: 0;
  font-size: 13px;
  color: #f59e0b;
}

.prose {
  margin-top: var(--space-4);
}

/* ---- Table of contents ---- */
.tocAside {
  position: sticky;
  top: 96px;
  align-self: start;
  padding-left: 16px;
  border-left: 1px solid var(--border);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
.tocHeading {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.tocInline {
  display: none;
  margin-top: var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 10px 14px;
}
.tocInline summary {
  cursor: pointer;
  font-weight: 850;
}
.tocInline[open] summary {
  margin-bottom: 8px;
}

:deep(.tocList) {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
  font-size: 14px;
  line-height: 1.4;
}
:deep(.tocList a) {
  color: var(--muted);
  text-decoration: none;
  font-weight: 700;
}
:deep(.tocList a:hover) {
  color: var(--accent);
}
:deep(.tocList .toc-h3) {
  padding-left: 12px;
  font-size: 13px;
}

/* ---- Footer ---- */
.articleFoot {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
}
.relatedTitle {
  margin: 0 0 14px;
  font-size: 22px;
  letter-spacing: -0.02em;
}
.relatedList {
  list-style: none;
  margin: 0 0 var(--space-4);
  padding: 0;
  display: grid;
  gap: 12px;
}

.notFound {
  max-width: 640px;
}
.notFoundTitle {
  margin: 0 0 6px;
  color: var(--text);
  font-size: 26px;
}
.notFound p + p {
  margin-top: 14px;
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
