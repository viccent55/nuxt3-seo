import { useDisplay } from "vuetify";

export function useLayoutManager() {
  const { smAndDown } = useDisplay();

  // Cookie persists user's layout
  const layoutCookie = useCookie<string>("server-layout", {
    maxAge: 60 * 60 * 24 * 365,
    default: () => "desktop",
  });

  // SSR-safe initial state
  const layout = useState<string>("layout", () => {
    // During SSR, use cookie value (if available)
    // Client will correct this later
    return layoutCookie.value || "desktop";
  });

  // Client-side correction
  if (process.client) {
    const newLayout = smAndDown.value ? "mobile" : "desktop";

    // Update only if mismatch (prevents flicker)
    if (layout.value !== newLayout) {
      layout.value = newLayout;
      layoutCookie.value = newLayout;
    }

    // Watch for future resizes
    watch(smAndDown, (isMobile) => {
      const newLayout = isMobile ? "mobile" : "desktop";
      if (layout.value !== newLayout) {
        layout.value = newLayout;
        layoutCookie.value = newLayout;
      }
    });
  }

  return {
    layoutName: layout,
  };
}
