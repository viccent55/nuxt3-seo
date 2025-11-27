import { faker } from "@faker-js/faker";
import { dataEncrypt } from "~/composables/useCrypto";

export default defineEventHandler(async (event) => {
  // During development, we can return mock data.
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  const method = event.method;
  const realURL = `${baseURL}/forbiddenVideo/detail`;
  // build curl with dynamic method
  const curlCmd = `curl -X ${method} "${realURL}"`;
  console.warn("🐚 CURL Equivalent:", curlCmd);
  return proxyRequest(event, realURL);
});
