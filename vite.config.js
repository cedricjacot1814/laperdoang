import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon-32.png",
        "apple-touch-icon.png",
        "og-image.png",
        "robots.txt",
      ],
      manifest: {
        name: "Laper Doang",
        short_name: "Laper Doang",
        description:
          "Semua dopamine-nya. Tanpa kalorinya. Pesan makanan yang gak pernah dateng.",
        lang: "id",
        theme_color: "#06b14f",
        background_color: "#f4faf5",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "index.html",
      },
    }),
  ],
});
