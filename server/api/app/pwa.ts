import { dataEncrypt } from "~/composables/useCrypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const method = event.method;
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  try {
    const data = dataEncrypt(body);
    const result = await $fetch(`${baseURL}/app/pwaInstalled`, {
      method,
      body: data,
    });

    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
});
