import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` must match the GitHub Pages repo subpath so built asset URLs resolve.
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
});
