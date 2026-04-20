// composables/usePwaInstall.ts
import { ref, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";

// We can't use `BeforeInstallPromptEvent` because it's not in the default TS lib
// and we don't want to add `vite-plugin-pwa/client` to `tsconfig.json`'s `types`
// as it can conflict with other types.
// So we define it ourselves.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let installPromptEvent: BeforeInstallPromptEvent | null = null;
const showInstallPrompt = ref(false);

const showInstallPromptUI = () => {
  const today = new Date().toISOString().split("T")[0];
  const lastShownDate = useLocalStorage<string>("installPromptDate", null);

  if (lastShownDate.value !== today) {
    // Defer state change to avoid hydration mismatch
    setTimeout(() => {
      showInstallPrompt.value = true;
      lastShownDate.value = today;
    }, 1);
  }
};

// Add the event listener as early as possible.
if (process.client) {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPromptEvent = e as BeforeInstallPromptEvent;
    showInstallPromptUI();
  });
}

export default function usePwaInstall() {
  const isIOS = ref(false);

  // only define these refs, not call useRegisterSW yet
  const needRefresh = ref(false);
  const updateServiceWorker = ref<() => void>(() => {});
  const offlineReady = ref(false);

  // ✅ Call useRegisterSW only on client
  if (process.client) {
    import("virtual:pwa-register/vue").then(({ useRegisterSW }) => {
      const sw = useRegisterSW({
        onRegisteredSW(swUrl, r) {
          console.log(`Service Worker registered:`, swUrl);
        },
        onRegisterError(error) {
          console.error("SW registration error:", error);
        },
      });

      needRefresh.value = sw.needRefresh.value;
      offlineReady.value = sw.offlineReady.value;
      updateServiceWorker.value = sw.updateServiceWorker;
    });
  }

  const closeInstallPrompt = () => (showInstallPrompt.value = false);

  const closeReloadPrompt = () => {
    offlineReady.value = false;
    needRefresh.value = false;
  };

  onMounted(() => {
    if (!process.client) return;

    const ua = navigator.userAgent;
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua);
    isIOS.value = isIosDevice;

    if (isStandalone) {
      showInstallPrompt.value = false;
      return;
    }

    if (isIosDevice) {
      showInstallPromptUI();
    }
  });

  return {
    showInstallPrompt,
    isIOS,
    promptInstall,
    closeInstallPrompt,
    closeReloadPrompt,
    needRefresh,
    updateServiceWorker,
  };
}
