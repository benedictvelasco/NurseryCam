import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "lucide-react": fileURLToPath(new URL("./node_modules/lucide-react", import.meta.url)),
    },
  },
});
