export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  try {
    // console.log('anime select : ', headers.authorization!)
    const result: EmptyObjectType = await $fetch(`${baseURL}/forbiddenVideo/select`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: headers.authorization!,
      },
    });
    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data data" };
  }
});
