// composables/useChatWidget.ts
import { ref } from "vue";

interface ChatWidgetOptions {
  API_URL: string;
  GROUP_ID: string;
  USER_ID: string;
  USER_NAME?: string;
  VISITOR_AVATAR?: string;
  containerId?: string;
  AUTO_OPEN: boolean;
  VISITOR_ID?: string;
  EXTRA?: string;
  USER_AVATAR: string;
}

declare global {
  interface Window {
    CHAT_WIDGET?: {
      initialize: (opts: ChatWidgetOptions) => void;
      mount?: (containerSelector: string) => void;
      renderButton?: () => void;
      open?: () => void; // some widgets have open()/show()
      close?: () => void;
      openChatWindow?: () => void;
    };
  }
}

export function useChatWidget() {
  const isReady = ref(false);
  const isVisible = ref(false); // control popup visibility
  const scriptUrl = "/api/chat-widget";

  const loadAndInitialize = async (options: ChatWidgetOptions) => {
    if (!process.client || isReady.value) return;
    // Load script if not in DOM
    const scriptId = "chat-widget-loader";
    if (!document.getElementById(scriptId)) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.id = scriptId;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (e) =>
          reject(new Error(`Failed to load script: ${e}`));
        document.head.appendChild(script);
      });
    }

    // Wait for CHAT_WIDGET global
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

    // Initialize
    if (!isReady.value) {
      // 1️⃣ Build your custom values
      const visitorId = options.VISITOR_ID || "guest_" + Date.now();
      const refer = encodeURIComponent(window.location.href);
      const extra = options.EXTRA || "";

      // 2️⃣ Attach these to the initialize options
      const finalOptions = {
        ...options,
        VISITOR_ID: visitorId,
        REFER: refer, // add refer
        EXTRA: extra, // ensure extra always exists
      };

      // 3️⃣ Initialize widget with enriched options
      window.CHAT_WIDGET.initialize(finalOptions);

      // 4️⃣ Mark ready
      isReady.value = true;

      // 5️⃣ Hide default widget button
      const style = document.createElement("style");
      style.textContent = `#chat-widget-button { display: none !important; }`;
      document.head.appendChild(style);
    }
  };

  /** Show / open the chat popup manually */
  const showChat = () => {
    if (!window.CHAT_WIDGET) return;
    if (typeof window.CHAT_WIDGET.openChatWindow === "function") {
      window.CHAT_WIDGET?.openChatWindow();
    } else if (typeof window.CHAT_WIDGET.renderButton === "function") {
      window.CHAT_WIDGET.renderButton();
    } else {
      console.warn("CHAT_WIDGET has no open() or renderButton() method");
    }
    isVisible.value = true;
  };

  return { loadAndInitialize, showChat, isReady, isVisible };
}
