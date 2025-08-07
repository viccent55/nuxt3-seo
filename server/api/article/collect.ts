export default defineEventHandler(async (event) => {
  const headers = getHeaders(event); // ✅Read Header
  const body = await readBody(event); // ✅ Read POST body
  const config = useRuntimeConfig();
  try {
    const result = await $fetch(
      `${config.public?.apiBase}/behavior/collectPost`,
      {
        method: "POST",
        body,
        headers: {
          Authorization: headers.authorization!,
        },
      }
    );

    return result; // Return the fetched result
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching group data:", error);
    return { error: "Failed to fetch group data" };
  }
});
