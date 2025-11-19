export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  return proxyRequest(event, `${baseURL}/member/items`);
});
