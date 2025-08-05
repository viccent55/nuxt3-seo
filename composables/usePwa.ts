import { useRegisterSW } from "virtual:pwa-register/vue";
import { onMounted, ref } from "vue";

// This will hold the event from 'beforeinstallprompt'
let installPromptEvent: (Event & { prompt: () => Promise<void> }) | null = null;

export function usePWA() {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker registered at: ${swUrl}`);
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  const showInstallPrompt = ref(false);
  const isIOS = ref(false);

  const promptInstall = async () => {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    installPromptEvent = null;
    showInstallPrompt.value = false;
    localStorage.removeItem("pwa-install-ready"); // ✅ reset
  };

  const closeInstallPrompt = () => {
    showInstallPrompt.value = false;
  };

  const closeReloadPrompt = () => {
    offlineReady.value = false;
    needRefresh.value = false;
  };

  onMounted(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    isIOS.value = isIosDevice;
    if (isStandalone) return;
    // Show prompt again if previously captured
    if (localStorage.getItem("pwa-install-ready") === "true") {
      showInstallPrompt.value = true;
    }

    if (isIosDevice) {
      showInstallPrompt.value = true;
    } else {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        installPromptEvent = e as any;
        localStorage.setItem("pwa-install-ready", "true");
        showInstallPrompt.value = true;
        console.log("`beforeinstallprompt` event was fired.");
      });
    }
  });

  return {
    // For updates
    needRefresh,
    updateServiceWorker,
    closeReloadPrompt,
    // For installation
    showInstallPrompt,
    isIOS,
    promptInstall,
    closeInstallPrompt,
  };
}
