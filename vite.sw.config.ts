import * as path from "path"
import { defineConfig } from "vite"

// Service worker must be a self-contained bundle (no external imports)
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: "./src/background/service-worker.ts",
      output: {
        // Single input allows inlineDynamicImports
        inlineDynamicImports: true,
        entryFileNames: `assets/service-worker.js`,
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
})
