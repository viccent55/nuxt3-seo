import { useDisplay } from "vuetify";

/**
 * A composable to manage layout switching in an SSR-friendly way.
 * It uses a cookie to persist the layout choice across requests,
 * preventing layout shifts on navigation.
 */
export function useLayoutManager() {
  // 1. Get Vuetify's display utility.
  const { smAndDown } = useDisplay();

  // 2. Create a cookie to store the layout hint.
  // 'server-layout' will be 'mobile' or 'desktop'.
  const layoutCookie = useCookie<string>("server-layout", {
    // Set a long max-age so the cookie persists.
    maxAge: 60 * 60 * 24 * 365, // 1 year
    // Default to 'desktop' on the very first visit.
    default: () => "desktop",
  });

  // 3. Use Nuxt's useState for a reactive value that is shared between server and client.
  // This is initialized with the cookie's value.
  const layout = useState<string>("layout", () => layoutCookie.value);

  // 4. On the client-side, after the component mounts, check the actual screen size.
  onMounted(() => {
    // Watch for changes in screen size (e.g., resizing the browser).
    watch(
      smAndDown,
      (isMobile) => {
        const newLayout = isMobile ? "mobile" : "desktop";
        // If the detected layout is different from the one in the cookie, update both.
        if (layout.value !== newLayout) {
          layoutCookie.value = newLayout;
          layout.value = newLayout;
        }
      },
      { immediate: true } // Run the watcher immediately on mount.
    );
  });

  // 5. Expose the reactive layout name.
  return {
    layoutName: layout,
  };
}
