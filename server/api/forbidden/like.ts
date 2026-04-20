export default defineEventHandler(async (event) => {
  const method = event.method;
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
    
  const realURL = `${baseURL}/like/toggle`;
  // build curl with dynamic method
  const curlCmd = `curl -X ${method} "${realURL}"`;
  console.warn("🐚 CURL Equivalent:", curlCmd);

  return proxyRequest(event, realURL);
});
