import { encrypt } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  // Encrypt the request body
  const encryptedBody = encrypt(body);

  try {
    // forward request to real backend
    const result = await $fetch(`${baseURL}/app/firstVisitInApp`, {
      method: "POST",
      body: encryptedBody, // Send the encrypted data
    });
    return result;
  } catch (error) {
    console.error("Error posting firstVisitInApp:", error);
    return { error: "Failed to send firstVisitInApp" };
  }
});
