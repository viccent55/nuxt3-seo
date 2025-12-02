import { useDisplay } from "vuetify";
import { Capacitor } from "@capacitor/core";

export function useLayoutManager() {
  const { smAndDown } = useDisplay();
  const layoutCookie = useCookie<string>("server-layout", {
    maxAge: 60 * 60 * 24 * 365,
    default: () => "desktop",
  });

  // 1️⃣ Early detection
  const userAgent =
    process.server && useRequestHeaders()?.["user-agent"]
      ? useRequestHeaders()["user-agent"]
      : navigator.userAgent;
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(
    userAgent || ""
  );

  // 2️⃣ Capacitor override
  const isCapacitor =
    typeof window !== "undefined" && typeof Capacitor !== "undefined";

  const layout = useState<string>("layout", () => {
    if (isCapacitor) return "mobile";
    return layoutCookie.value || (isMobileUA ? "mobile" : "desktop");
  });

  // 3️⃣ Reactive update (for browser resize)
  const updateLayout = (isMobile: boolean) => {
    const newLayout = isMobile ? "mobile" : "desktop";
    if (layout.value !== newLayout) {
      layout.value = newLayout;
      layoutCookie.value = newLayout;
    }
  };
  updateLayout(smAndDown.value);
  watch(smAndDown, updateLayout);
  return { layoutName: layout };
}
