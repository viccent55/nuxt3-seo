export default defineEventHandler(async (event) => {
  const query = getQuery(event); // { position: "123" }
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal
    : config.public.apiBase;

  try {
    const result: EmptyObjectType = await $fetch(
      `${baseURL}/advert/${query.position}`,
      { method: "GET" }
    );

    return result;
  } catch (error) {
    console.error("Error fetching group data:", error);
    return { error: "Failed to fetch group data" };
  }
});
