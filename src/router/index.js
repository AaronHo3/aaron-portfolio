import { createRouter, createWebHashHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Projects from "../pages/Projects.vue";
import About from "../pages/About.vue";
import Contact from "../pages/Contact.vue";

export const router = createRouter({
  history: createWebHashHistory(), // use hash history for GitHub Pages
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/projects", name: "projects", component: Projects },
    { path: "/about", name: "about", component: About },
    { path: "/contact", name: "contact", component: Contact },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});