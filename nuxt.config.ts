import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      title: "Default Title",
      meta: [
        { name: "description", content: "Default description" },
        { name: "author", content: "Your Name" },
        { name: "keywords", content: "nuxt, vue, web" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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
    includeAssets: ["/images/logo.png"],
    client: {
      installPrompt: true,
    },
    manifest: {
      name: "Nuxt Seo",
      short_name: "Nuxt Seo",
      description: "Nuxt Seo .. Cn!",
      theme_color: "#fefefeff",
      background_color: "#CFD8DC",
      display: "standalone",
      start_url: "/",
      scope: "/",
      icons: [
        {
          src: "/images/logo.png",
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
      enabled: false, // no SW in dev
      type: "module",
    },
  },
  devServer: {
    port: 8088,
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
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
});
