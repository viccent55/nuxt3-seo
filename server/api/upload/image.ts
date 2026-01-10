// server/api/upload/image.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const baseURL = import.meta.dev
    ? config.public.apiLocal // dev API
    : config.public.apiBase; // prod API

  const realURL = `${baseURL}/upload/image`;

  // debug
  console.warn("🐚 Upload proxy →", realURL);

  // IMPORTANT:
  // - Do NOT read body here
  // - Do NOT parse FormData here
  // - Just stream proxy
  return proxyRequest(event, realURL);
});
