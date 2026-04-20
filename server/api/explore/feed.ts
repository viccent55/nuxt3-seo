export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  const method = event.method;
  // const method = "POST";
  const realURL = `${baseURL}/item/recommend`;
  // build curl with dynamic method
  const curlCmd = `curl -X ${method} "${realURL}"`;
  console.warn("🐚 CURL Equivalent:", curlCmd);

  return proxyRequest(event, realURL);
});
