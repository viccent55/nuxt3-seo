export default defineEventHandler(async (event) => {
  const method = event.method;
  const headers = getHeaders(event);
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  try {
    const result: EmptyObjectType = await $fetch(`${baseURL}/behavior/starScand`, {
      method: method ?? "POST",
      headers: {
        Authorization: headers.authorization!,
      },
      body,
    });
    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
});
