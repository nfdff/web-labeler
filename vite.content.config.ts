import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// Content script must be a self-contained bundle (no external imports)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: "./src/contentScript/index.ts",
      output: {
        // Single input allows inlineDynamicImports
        inlineDynamicImports: true,
        entryFileNames: `assets/contentScript.js`,
        assetFileNames: "assets/contentScript[extname]",
      },
    },
  },
})
