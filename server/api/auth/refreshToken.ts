export default defineEventHandler(async (event) => {
  const method = event.method;
  const headers = getHeaders(event);
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  try {
    // forward request to real backend
    const result = await $fetch(`${baseURL}/index/refreshToken`, {
      method: method ?? "POST",
      headers: {
        Authorization: headers.authorization!,
      },
      body,
    });
    return result;
  } catch (error) {
    console.error("Error Fetching:", error);
    return { error: "Failed to request" };
  }
});
