import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useDisplay } from "vuetify";
import { useStore } from "@/store";

const useCapacitor = () => {
  const { smAndDown } = useDisplay();
  const store = useStore();
  const setStatus = async (isVisible: boolean) => {
    if (!Capacitor.isNativePlatform() || !smAndDown.value) {
      return;
    }

    if (isVisible && store.darkMode === "light") {
      // When dialog opens, set status bar to black
      await StatusBar.setBackgroundColor({ color: "#000000" }); // Black
      // Optional: If you want red, use { color: '#FF0000' }
      // Set status bar icons to light (white) to be visible on a dark background
      await StatusBar.setStyle({ style: Style.Light });
    } else {
      // When dialog closes, reset status bar to transparent for edge-to-edge UI
      await StatusBar.setBackgroundColor({ color: "#00000000" });
      // Reset status bar icons to dark
      await StatusBar.setStyle({ style: Style.Dark });
    }
  };
  return {
    setStatus,
  };
};

export default useCapacitor;
