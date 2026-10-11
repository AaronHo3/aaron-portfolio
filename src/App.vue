<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">Skip to content</a>
  <SiteHeader />
  <main id="main" ref="mainRef" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter />
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SiteHeader from "./components/layout/SiteHeader.vue";
import SiteFooter from "./components/layout/SiteFooter.vue";

const route = useRoute();
const router = useRouter();
const mainRef = ref(null);

// The router starts at a placeholder "/" before resolving the real URL; that
// first resolution is a page load, not a navigation, so focus stays put.
let initialNavigationDone = false;
router.isReady().then(() => {
  initialNavigationDone = true;
});

// The skip link cannot use a plain #main href: hash routing would treat it as a route.
function focusMain() {
  mainRef.value?.focus();
}

// After navigating to a new page (not an in-page anchor), move focus to the
// content so screen-reader and keyboard users start at the new page.
watch(
  () => route.path,
  (to, from) => {
    if (initialNavigationDone && to !== from) mainRef.value?.focus({ preventScroll: true });
  },
);
</script>

<style>
#app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

main:focus {
  outline: none;
}
</style>
