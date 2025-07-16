// plugins/pinia.plugin.ts
import { defineNuxtPlugin } from "#app";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { usePinia } from "#imports";

export default defineNuxtPlugin(() => {
  const pinia = usePinia();
  pinia.use(piniaPluginPersistedstate);
});
