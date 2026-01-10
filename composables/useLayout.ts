import { computed } from "vue";
import { useDisplay } from "vuetify";

export function useLayout() {
  const nuxtApp = useNuxtApp();

  // 1️⃣ Detect mobile on SERVER using UA
  const isMobileSSR = computed(() => {
    if (!process.server) return false;

    const ua =
      nuxtApp.ssrContext?.event.node.req.headers["user-agent"] || "";

    return /mobile|android|iphone|ipad|ipod/i.test(ua);
  });

  // 2️⃣ Detect mobile on CLIENT using Vuetify
  const { smAndDown } = useDisplay();

  const isMobile = computed(() => {
    if (process.server) {
      return isMobileSSR.value;
    }
    return smAndDown.value;
  });

  const layoutName = computed<"mobile" | "desktop">(() =>
    isMobile.value ? "mobile" : "desktop"
  );

  return {
    layoutName,
    isMobile,
  };
}
