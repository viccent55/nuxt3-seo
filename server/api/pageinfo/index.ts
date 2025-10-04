export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  try {
    const result: EmptyObjectType = await $fetch(
      `${baseURL}/article-${params.pageName}`,
      {
        method: "GET",
      }
    );
    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data data" };
  }
});
