import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
const isCapacitor = process.env.NUXT_CAPACITOR === "true";

export default defineNuxtConfig({
  // 👇 Automatically switch
  ssr: !isCapacitor, // true for web, false for Capacitor
  nitro: {
    preset: isCapacitor ? "static" : "node-server", // Generate static output for Capacitor
  },
  app: {
    head: {
      title: "小红书成人版",
      meta: [
        { name: "description", content: "Default description" },
        { name: "author", content: "小红书成人版" },
        { name: "keywords", content: "nuxt, vue, web" },
        { property: "og:type", content: "website" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://redbook.xhltbes.com",
        },
        {
          rel: "https://redbook.xhltbes.com/",
          href: "https://redbook.xhltbes.com",
        },
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
    transpile: [
      "vuetify",
      process.env.NODE_ENV === "development" ? "" : "crypto-js",
    ],
  },
  runtimeConfig: {
    public: {
      apiLocal: process.env.LOCAL_API_BASE,
      apiBase: process.env.PROD_API_BASE,
      apiMember: process.env.MEMBER_API_BASE,
      imageHost: process.env.IMAGE_HOST, // Expose IMAGE_HOST
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
    client: {
      installPrompt: true,
    },
    registerType: "autoUpdate",
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
          type: "image/webp",
        },
        {
          src: "/icons/icon-192.webp",
          sizes: "192x192",
          type: "image/webp",
        },
        {
          src: "/icons/icon-256.webp",
          sizes: "256x256",
          type: "image/webp",
        },
        {
          src: "/icons/icon-512.webp",
          sizes: "512x512",
          type: "image/webp",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: true,
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
    optimizeDeps: {
      include: ["crypto-js"],
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  },
});
