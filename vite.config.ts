import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: "motion", includeDependenciesRecursively: false, test: /node_modules\/(framer-motion|motion-dom|motion-utils)\// }],
        },
      },
    },
  },
});
