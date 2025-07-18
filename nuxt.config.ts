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
  imports: {
    presets: [
      {
        from: "vue",
        imports: ["reactive"], // Now reactive is auto-imported!
      },
    ],
  },
  // routeRules: {
  //   "/": { redirect: "/home" },
  // },
  build: {
    transpile: ["vuetify"],
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
    manifest: {
      name: "My Nuxt PWA App",
      short_name: "NuxtPWA",
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
});
