import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Gunakan base path relatif agar bekerja di semua environment
// (preview di sini, GitHub Pages, Netlify, dll)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
