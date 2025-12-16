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
    rollupOptions: {
      input: {
        index: "./index.html",
      },
      output: {
        // //TODO: replace non-hashed-filenames with creating manifest.json
        // // https://rollupjs.org/plugin-development/#build-hooks
        entryFileNames: `assets/[name].js`,
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
})
