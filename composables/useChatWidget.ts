import { ref } from "vue";

interface ChatWidgetOptions {
  API_URL: string;
  AGENT_ID: string;
  USER_ID?: string;
  USER_NAME?: string;
  USER_AVATAR?: string;
  containerId?: string;
}

declare global {
  interface Window {
    CHAT_WIDGET?: {
      initialize: (opts: ChatWidgetOptions) => void;
      mount?: (containerSelector: string) => void; // if widget supports mount
      renderButton?: () => void; // if widget supports renderButton
    };
  }
}

export function useChatWidget() {
  const isReady = ref(false);
  const scriptUrl = '/api/chat-widget'; 
  const loadAndInitialize = async (options: ChatWidgetOptions) => {
    if (!process.client) return;
    if (isReady.value) return;

    // Only append the script if it’s not already in DOM
    const scriptId = "chat-widget-loader";
    if (!document.getElementById(scriptId)) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl; // directly load the proxy
        script.id = scriptId;
        script.async = true;

        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error(`Failed to load script: ${e}`));

        document.head.appendChild(script);
      });
    }

    // Wait for CHAT_WIDGET global to appear
    let attempts = 0;
    const maxAttempts = 50;
    while (!window.CHAT_WIDGET && attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }

    if (!window.CHAT_WIDGET) {
      console.warn("CHAT_WIDGET not found after script load");
      return;
    }

    // Initialize only once
    if (!isReady.value) {
      window.CHAT_WIDGET.initialize({
        ...options
      });

      // Mount / render UI if widget supports it
      if (options.containerId && typeof window.CHAT_WIDGET.mount === "function") {
        window.CHAT_WIDGET.mount(`#${options.containerId}`);
      } else if (typeof window.CHAT_WIDGET.renderButton === "function") {
        window.CHAT_WIDGET.renderButton();
      } else {
        console.warn(
          "CHAT_WIDGET does not provide mount() or renderButton(). Check widget docs or backend implementation."
        );
      }

      isReady.value = true;
    }
  };

  return { loadAndInitialize, isReady };
}
