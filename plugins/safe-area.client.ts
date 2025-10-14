import { Capacitor } from "@capacitor/core";
import { SafeArea } from "capacitor-plugin-safe-area";
import { StatusBar, Style } from "@capacitor/status-bar";

export default defineNuxtPlugin(() => {
  if (!Capacitor.isNativePlatform()) return;

  const setSafeArea = (insets: any) => {
    if (insets && document) {
      for (const [key, value] of Object.entries(insets)) {
        document.documentElement.style.setProperty(
          `--safe-area-inset-${key}`,
          `${value}px`
        );
      }
    }
  };

  const initStatusBar = async () => {
    await StatusBar.setBackgroundColor({ color: "#00000000" }); // transparent
    await StatusBar.setStyle({ style: Style.Dark }); // dark text/icons
  };

  if (Capacitor.isPluginAvailable("SafeArea")) {
    SafeArea.getSafeAreaInsets().then(({ insets }) => setSafeArea(insets));
    SafeArea.addListener("safeAreaChanged", (data: any) =>
      setSafeArea(data.insets)
    );
    initStatusBar();
  }
});
