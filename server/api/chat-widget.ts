import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const apiChatWidget = useRuntimeConfig().public.apiChatWidget;
    // Use global fetch (Nuxt 3 provides fetch server-side)
    // http://live.xhltfes.com/static/js/chat-widget.js
    const res = await fetch(`${apiChatWidget}/static/js/chat-widget.js`);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const js = await res.text();

    // Return as JavaScript
    event.node.res.setHeader("Content-Type", "application/javascript");
    return js;
  } catch (err) {
    console.error("Failed to fetch chat-widget.js", err);
    event.node.res.statusCode = 500;
    return 'console.error("Failed to load chat widget");';
  }
});
