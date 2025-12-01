import { useDisplay } from "vuetify";

export const useLayoutManager = () => {
  const layoutName = useState<"desktop" | "mobile">(
    "layout-name",
    () => "desktop"
  );

  // ✅ 1. SSR detection (first open)
  if (process.server) {
    const ua = useRequestHeader("user-agent") || "";
    layoutName.value = /android|iphone|ipad|ipod|mobile/i.test(ua)
      ? "mobile"
      : "desktop";
  }

  if (process.client) {
    const update = () => {
      // ✅ 2. Real responsive detection using viewport width
      layoutName.value = window.innerWidth <= 768 ? "mobile" : "desktop";
    };

    // ✅ 2.5 auto trigger on resize (real responsive behavior)
    window.addEventListener("resize", update);
    update(); // run immediately on client mount

    // ✅ 3. Hydrate with Vuetify display (extra safety)
    const { smAndDown } = useDisplay();
    nextTick(() => {
      watchEffect(() => {
        layoutName.value = smAndDown.value ? "mobile" : "desktop";
      });
    });
  }

  return { layoutName };
};
