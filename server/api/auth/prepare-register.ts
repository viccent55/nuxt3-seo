import { encrypt } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  try {
    // forward request to real backend
    const result = await $fetch(`${baseURL}/index/prepareRegister`, {
      method: "POST",
      body,
    });
    return result;
  } catch (error) {
    console.error("Error  prepareRegister:", error);
    return { error: "Failed to send prepareRegister" };
  }
});
