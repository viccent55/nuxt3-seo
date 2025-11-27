export default defineEventHandler(async (event) => {
  const position = event.context.params?.id;
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  const method = event.node.req.method;
  // const method = "POST";
  const realURL = `${baseURL}/advert/${position}`;
  // build curl with dynamic method
  const curlCmd = `curl -X ${method} "${realURL}"`;
  console.warn("🐚 CURL Equivalent:", curlCmd);
  try {
    const result = await $fetch(`${baseURL}/advert/${position}`, {
      method: "GET",
    });
    return result;
  } catch (error) {
    console.error("Error fetching ad data:", error);
    return { error: "Failed to fetch ad data" };
  }
});
