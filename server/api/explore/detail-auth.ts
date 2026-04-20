export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  // In production, proxy the request to the actual backend API.
  return proxyRequest(event, `${baseURL}/content/detail`);
});
