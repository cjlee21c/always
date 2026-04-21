import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ask": "http://localhost:4000",
      "/summary": "http://localhost:4000",
      "/reviews": "http://localhost:4000",
    },
  },
});
