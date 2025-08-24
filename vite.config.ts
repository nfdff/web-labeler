import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
});
