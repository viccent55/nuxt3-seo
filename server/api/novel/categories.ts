export default defineEventHandler(async (event) => {
  const method = event.method;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  try {
    const result: EmptyObjectType = await $fetch(
      `${baseURL}/novel/categories`,
      {
        method: method,
        body,
      }
    );
    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
});
