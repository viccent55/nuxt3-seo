export default defineEventHandler(async (event) => {
  const position = event.context.params?.id;
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  try {
    const result = await $fetch(`${baseURL}/advert/${position}`, { method: "GET" });
    return result;
  } catch (error) {
    console.error("Error fetching ad data:", error);
    return { error: "Failed to fetch ad data" };
  }
});
