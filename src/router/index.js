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

export const router = createRouter({
  history: createWebHashHistory(), // use hash history for GitHub Pages
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/projects", name: "projects", component: Projects },
    { path: "/about", name: "about", component: About },
    { path: "/contact", name: "contact", component: Contact },
    { path: "/projects/:slug", name: "projectDetail", component: ProjectDetail },
    { path: "/blog", name: "blog", component: Blog },
    { path: "/blog/:slug", name: "blogPost", component: BlogPost },
    { path: "/reading-club", name: "readingClub", component: ReadingClub },
  ],
  scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition;
  // In-page anchors (article table of contents): offset for the fixed navbar.
  if (to.hash && to.path === from.path) return { el: to.hash, top: 96, behavior: "smooth" };
  return { top: 0, behavior: "smooth" };
  },
});