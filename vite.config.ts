import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site: https://nabihsabeh85.github.io/kneadedwithlove/
const base = process.env.GITHUB_PAGES === "true" ? "/kneadedwithlove/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
