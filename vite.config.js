import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { blogPlugin } from "./build/blog-plugin.js";

export default defineConfig({
  plugins: [vue(), blogPlugin()],
  base: "/",
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
