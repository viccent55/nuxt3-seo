import FsLightbox from "fslightbox-vue";

export default defineNuxtPlugin((nuxtApp) => {
  // Register FsLightbox as a global component, only on the client side.
  nuxtApp.vueApp.component("FsLightbox", FsLightbox);
});
