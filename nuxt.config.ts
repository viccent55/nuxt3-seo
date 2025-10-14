import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      title: "吃瓜百科",
      meta: [
        { name: "description", content: "" },
        { name: "author", content: "吃瓜百科" },
        { name: "keywords", content: "" },
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://api.szy7.com/apiv1",
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
    includeAssets: ["/logo.png", "/favicon.ico", "/apple-touch-icon.png"],
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
          src: "/images/pwa/128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "/images/pwa/256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "/images/pwa/512.png",
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
    optimizeDeps: {
      include: ["hls.js"],
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      allowedHosts: true,
    },
  },

  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  },
});
