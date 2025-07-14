import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  //...
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
   
  ],
 pwa: {
    manifest: {
      name: 'My Nuxt PWA App',
      short_name: 'NuxtPWA',
    },
   
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
