import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        contentScript: "./src/contentScript/index.ts",
        "service-worker": "./src/background/service-worker.ts",
      },
      output: {
        manualChunks: undefined,
        //TODO: replace non-hashed-filenames with creating manifest.json
        // https://rollupjs.org/plugin-development/#build-hooks
        entryFileNames: () => {
          return "assets/[name].js"
        },
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
})
