// composables/useChatWidget.ts
import { ref } from 'vue';

export function useChatWidget() {
  const loaded = ref(false);
  const widgetReady = ref(false);

  const baseUrl = "http://live.xhltfes.com"; // Backend URL

  async function loadScript() {
    if (loaded.value) return;

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${baseUrl}/static/js/chat-widget.js`;
      script.async = true;

      script.onload = () => {
        loaded.value = true;
        resolve();
      };

      script.onerror = (e) => {
        console.error('Failed to load chat widget script', e);
        reject(e);
      };

      document.head.appendChild(script);
    });
  }

  async function init(options?: { AGENT_ID?: string; USER_ID?: string; USER_NAME?: string; USER_AVATAR?: string }) {
    if (!process.client) return;
    await loadScript();

    if (!window.CHAT_WIDGET) {
      console.warn("CHAT_WIDGET not found!");
      return;
    }

    if (!widgetReady.value) {
      widgetReady.value = true;
      window.CHAT_WIDGET.initialize({
        API_URL: baseUrl,
        AGENT_ID: options?.AGENT_ID || "agent",
        USER_ID: options?.USER_ID || "",
        USER_NAME: options?.USER_NAME || "Anonymous",
        USER_AVATAR: options?.USER_AVATAR || ""
      });
    }
  }

  return {
    loadScript,
    init,
    loaded,
    widgetReady
  };
}
