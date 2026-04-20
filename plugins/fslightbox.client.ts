import FsLightbox from "fslightbox-vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("FsLightbox", FsLightbox);
});
