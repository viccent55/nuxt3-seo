export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  try {
    // Use proxyRequest for better performance and streaming
    return proxyRequest(event, `${apiBase}/behavior/comment`);
  } catch (error) {
    // Handle errors gracefully
    console.error("Error proxying request:", error);
    return { error: "Failed to proxy request" };
  }
});
