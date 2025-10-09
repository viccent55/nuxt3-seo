import { useRegisterSW } from "virtual:pwa-register/vue";
import { onMounted, ref } from "vue";
import { pwaInstalled } from "@/service/app";
import { useLocalStorage } from "@vueuse/core";

// This will hold the event from 'beforeinstallprompt'
let installPromptEvent: (Event & { prompt: () => Promise<void> }) | null = null;

export default function usePwaInstall() {
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
  };

  const closeInstallPrompt = () => {
    showInstallPrompt.value = false;
  };

  const closeReloadPrompt = () => {
    offlineReady.value = false;
    needRefresh.value = false;
  };
  const initPupup = () => {
    const ua = window.navigator.userAgent;
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    isIOS.value = isIosDevice;
    // Don't show the prompt if the app is already installed
    if (isStandalone) return;

    const showPromptIfNeeded = () => {
      if (!process.client) return; 
      const today = new Date().toISOString().split("T")[0];
      const lastShownDate = useLocalStorage<string>("installPromptDate", null);

      if (lastShownDate.value !== today) {
        showInstallPrompt.value = true;
        lastShownDate.value = today;
        return true;
      }
      return false;
    };

    if (isIosDevice) {
      // For iOS, check immediately.
      showPromptIfNeeded();
    } else {
      // For other browsers, wait for the event, then check.
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        installPromptEvent = e as any;
        if (showPromptIfNeeded()) {
          console.log(
            "`beforeinstallprompt` event was fired and prompt shown."
          );
        }
      });
    }
  };

  const dialogIosGuide = ref();
  const openDialogIos = () => {
    closeInstallPrompt();
    dialogIosGuide.value.openDialog();
  };

  onMounted(() => {
    // Detect if the user is on an iOS device
    const ua = window.navigator.userAgent;
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua);
    isIOS.value = isIosDevice;

    // Don't show the prompt if the app is already installed
    if (isStandalone) {
      return;
    }

    if (isIosDevice) {
      // On iOS, we just show the instruction prompt.
      showInstallPrompt.value = true;
    } else {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        installPromptEvent = e as any;
        // Update UI to notify the user they can install the PWA
        showInstallPrompt.value = true;
        console.log("`beforeinstallprompt` event was fired.");
      });
    }
  });
  const { getDeviceInfo, route, storeUser } = useVariable();
  const onInstall = async () => {
    await promptInstall();
    const device = getDeviceInfo();
    let type = 0;
    switch (true) {
      case device.isAndroid:
        type = 1; // Android
        break;
      case device.isIos:
        type = 2; // iOS
        break;
      case device.isMac:
        type = 3; // macOS
        break;
      case device.isWindows:
        type = 4; // Windows
        break;
      default:
        type = 0; // Unknown
    }
    const param = route.query.chan || "";
    const urlParams = new URLSearchParams(window.location.search);
    const chan = String(urlParams.get("chan") || param);
    const cleanedChan = chan.replace(/\/+$/, "");
    const request = {
      chan: cleanedChan,
      visitor: storeUser.visitCode,
      type: type,
    };
    await pwaInstalled(request);
    closeInstallPrompt();
  };
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
    onInstall,
    initPupup,
    openDialogIos,
    dialogIosGuide,
  };
}
