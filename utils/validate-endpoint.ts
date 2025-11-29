import { H3Event } from "h3";

export function validateEndpoint(event: H3Event, endPoint: string) {
  const method = event.method;
  // build curl with dynamic method
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  const realUrl = `${baseURL}${endPoint}`;
  const curlCmd = `curl -X ${method} "${realUrl}"`;
  console.warn("🐚 CURL Equivalent:", curlCmd);
  
  return realUrl;
}
