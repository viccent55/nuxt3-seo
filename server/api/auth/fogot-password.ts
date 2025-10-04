import { encrypt } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  const encryptedBody = encrypt(body);

  try {
    // forward request to real backend
    const result = await $fetch(`${baseURL}/index/forgotPassword`, {
      method: "POST",
      body: encryptedBody,
    });
    return result;
  } catch (error) {
    console.error("Error posting firstVisitInApp:", error);
    return { error: "Failed to send firstVisitInApp" };
  }
});
