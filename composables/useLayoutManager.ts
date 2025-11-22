import { useDisplay } from "vuetify";
type LayoutMode = "mobile" | "desktop";

export function useLayoutManager() {
  const { smAndDown } = useDisplay();

  const layoutCookie = useCookie<LayoutMode>("server-layout", {
    maxAge: 60 * 60 * 24 * 365,
    default: () => "mobile",
  });

  const layout = useState<LayoutMode>("layout", () => {
    return layoutCookie.value || "desktop";
  });

  if (process.client) {
    const newLayout = smAndDown.value ? "mobile" : "desktop";

    if (layout.value !== newLayout) {
      layout.value = newLayout;
      layoutCookie.value = newLayout;
    }

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
