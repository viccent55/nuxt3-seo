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
        { rel: "icon", type: "image/x-icon", href: "/icon-basis32x32.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/icon-basis32x32.ico",
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
    "/dashboard": { redirect: "/dashboard/profile" },
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
    includeAssets: ["/logo.png"],
    client: {
      installPrompt: true,
    },
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
          src: "/logo.png",
          sizes: "64x64",
          type: "image/png",
        },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: "/",
      globPatterns: ["**/*", "200"],
    },
    devOptions: {
      enabled: process.env.NODE_ENV === "development", // Only enable in dev
      type: "module",
      navigateFallback: "/",
    },
  },
  devServer: {
    port: 3000,
    // host: "0.0.0.0",
  },
  vite: {
    optimizeDeps: {
      include: ["hls.js"],
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      allowedHosts: ["cgbk.com"], // ✅ 添加你的域名/IP
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: process.env.NODE_ENV === "development" },
});
