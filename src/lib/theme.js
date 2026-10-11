/**
 * Theme state. Dark is the default; it applies via <html data-theme="dark">,
 * which the inline script in index.html sets before first paint unless the
 * visitor has chosen light.
 *
 * Only an explicit toggle writes `theme-preference`. The legacy `theme` key (written on every page load by the
 * old toggle, so not a real choice) is intentionally ignored.
 */
import { ref } from "vue";

const STORAGE_KEY = "theme-preference";

export const theme = ref(
  typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light",
);

/** @param {"light" | "dark"} next */
export function setTheme(next) {
  theme.value = next;
  if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage blocked (private mode): the choice lasts for this page view only.
  }
}

export function toggleTheme() {
  setTheme(theme.value === "dark" ? "light" : "dark");
}
