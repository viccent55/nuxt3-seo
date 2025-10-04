export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  try {
    const result = await $fetch(`${baseURL}/actor/latest`, {
      method: "POST",
      body,
    });

    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching group data:", error);
    return { error: "Failed to fetch group data" };
  }
});
