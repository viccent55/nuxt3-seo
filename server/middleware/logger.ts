import { decrypt } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  if (import.meta.dev) {
    const method = getMethod(event);
    const url = getRequestURL(event);

    console.log(`\n[DEV][REQUEST] ${method} ${url.href}`);

    try {
      if (method === "GET") {
        console.log("[DEV][QUERY]", getQuery(event));
      } else {
        const body = await readBody(event);
        console.log("[DEV][BODY]", decrypt(body.data));
      }
    } catch (e) {
    }
  }
});
