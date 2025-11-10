export default defineEventHandler(async (event) => {
  const headers = getHeaders(event);
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = config.apiMember;
  try {
    const result: EmptyObjectType = await $fetch(`${baseURL}/browse/logs`, {
      method: "POST",
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
