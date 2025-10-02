import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      title: "吃瓜百科",
      meta: [
        { name: "description", content: "Default description" },
        { name: "author", content: "吃瓜百科" },
        { name: "keywords", content: "nuxt, vue, web" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/icons/icon-72.webp" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/icons/icon-96.webp",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

  css: ["public/css/main.scss"],
  routeRules: {
    // "/": { redirect: "/home" },
  },
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  pwa: {
    registerType: "prompt",
    includeAssets: [
      "/icons/icon-128.webp",
      "/default-icon.svg",
      "/apple-touch-icon.png",
    ],
    manifest: {
      name: "吃瓜百科",
      short_name: "吃瓜百科",
      description: "吃瓜百科 .. Cn!",
      theme_color: "#fefefeff",
      background_color: "#CFD8DC",
      display: "standalone",
      start_url: "/",
      scope: "/",
      icons: [
        {
          src: "/icons/icon-128.webp",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "/icons/icon-192.webp",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-256.webp",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "/icons/icon-512.webp",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: process.env.NODE_ENV === "development", // no SW in dev
      type: "module",
    },
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },
  vite: {
    server: {
      allowedHosts: true,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  },
});
