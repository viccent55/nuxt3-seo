export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  return proxyRequest(event, `${baseURL}/index/config`);
});
