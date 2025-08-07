export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const headers = getHeaders(event); // ✅ Read Header
  const body = await readBody(event); // ✅ Read POST body
  try {
    const result = await $fetch(`${config.public?.apiBase}/member/setInfo`, {
      method: "POST",
      body,
      headers: {
        Authorization: headers.authorization!,
      },
    });

    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching group data:", error);
    return { error: "Failed to fetch group data" };
  }
});
