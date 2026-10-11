import { createRouter, createWebHashHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Projects from "../pages/Projects.vue";
import About from "../pages/About.vue";
import Contact from "../pages/Contact.vue";
import ProjectDetail from "../pages/ProjectDetail.vue";

// Blog pages are lazy-loaded so their styles (KaTeX, article typography) and
// content stay out of the main bundle.
const Blog = () => import("../pages/Blog.vue");
const BlogPost = () => import("../pages/BlogPost.vue");
const ReadingClub = () => import("../pages/ReadingClub.vue");

const SITE_TITLE = "Aaron Ho - AI/ML for Biotech & Healthcare";

/** Offset for in-page anchors so headings clear the sticky header (--header-h + 16px). */
const ANCHOR_OFFSET = 80;

export const router = createRouter({
  history: createWebHashHistory(), // use hash history for GitHub Pages
  routes: [
    { path: "/", name: "home", component: Home, meta: { title: SITE_TITLE } },
    { path: "/projects", name: "projects", component: Projects, meta: { title: "Projects | Aaron Ho" } },
    { path: "/about", name: "about", component: About, meta: { title: "About | Aaron Ho" } },
    { path: "/contact", name: "contact", component: Contact, meta: { title: "Contact | Aaron Ho" } },
    // ProjectDetail, Blog, BlogPost, and ReadingClub set their own titles.
    { path: "/projects/:slug", name: "projectDetail", component: ProjectDetail },
    { path: "/blog", name: "blog", component: Blog },
    { path: "/blog/:slug", name: "blogPost", component: BlogPost },
    { path: "/reading-club", name: "readingClub", component: ReadingClub },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash && to.path === from.path) return { el: to.hash, top: ANCHOR_OFFSET };
    return { top: 0 };
  },
});

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title;
});
