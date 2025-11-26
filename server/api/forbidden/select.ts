import { faker } from "@faker-js/faker";
import { dataEncrypt } from "~/composables/useCrypto";

export default defineEventHandler(async (event) => {
  // During development, we can return mock data.
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  return proxyRequest(event, `${baseURL}/forbiddenVideo/select`);
});
