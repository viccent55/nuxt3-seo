export default defineEventHandler(async (event) => {
  const { position } = getQuery(event) as { position?: string };
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;
  const pos = Number(position);

  try {
    const result = await $fetch(`${baseURL}/advert/${pos}`, { method: "GET" });
    return result;
  } catch (error) {
    console.error("Error fetching ad data:", error);
    return { error: "Failed to fetch ad data" };
  }
});
