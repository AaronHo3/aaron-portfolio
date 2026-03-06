import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/aaron-portfolio/",
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
