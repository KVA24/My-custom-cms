import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 3000
  },
  css: {
    postcss: "./postcss.configs.js",
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  server: {
    port: 4008,
    open: true,
    cors: true,
    strictPort: true,
  },
})
