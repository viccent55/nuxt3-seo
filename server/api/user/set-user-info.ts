export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  try {
    const result: EmptyObjectType = await $fetch(
      `${baseURL}/member/setinfo`,
      {
        method: "POST",
        headers: {
          Authorization: headers.authorization!,
        },
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
