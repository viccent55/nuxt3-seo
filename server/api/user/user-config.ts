export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event);
    const params = getQuery(event);
    const config = useRuntimeConfig();
    const baseURL = import.meta.dev
      ? config.public.apiLocal
      : config.public.apiBase;

    // $fetch expects query params as an object
    const result: EmptyObjectType = await $fetch(`${baseURL}/config/settings`, {
      method: "POST",
      headers: {
        Authorization: headers.authorization ?? "",
      },
      params, // pass query params as object
    });

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
});
