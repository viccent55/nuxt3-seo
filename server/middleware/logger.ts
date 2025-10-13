

export default defineEventHandler(async (event) => {
  if (import.meta.dev) {
    const method = event.method;
    const url = getRequestURL(event);

    console.log(`\n[DEV][REQUEST] ${method} ${url.href}`);

    try {
      if (method === "POST" || method === "PUT" || method === "PATCH") {
        const body = await readBody(event);
        console.log("[DEV][BODY]", body);
      } else if (method === "GET") {
        console.log("[DEV][QUERY]", getQuery(event));
      }
    } catch (e) {}
  }
});
