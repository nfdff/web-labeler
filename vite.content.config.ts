import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        contentScript: "./src/contentScript/index.ts",
        "service-worker": "./src/background/service-worker.ts",
      },
      output: {
        manualChunks: undefined,
        // //TODO: replace non-hashed-filenames with creating manifest.json
        // // https://rollupjs.org/plugin-development/#build-hooks
        entryFileNames: (chunkInfo) => {
          // Service worker goes to root, others go to assets
          if (chunkInfo.name === "service-worker") {
            return "[name].js";
          }
          return "assets/[name].js";
        },
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
