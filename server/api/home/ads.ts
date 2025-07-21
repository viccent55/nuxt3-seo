export default defineEventHandler(async (event) => {
  const body = await readBody(event); // ✅ Read POST body
  const config = useRuntimeConfig();
  try {
    const result = await $fetch(
      `${config.public?.apiBase}/advert/getByPositions`,
      {
        method: "POST",
        body,
      }
    );

    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching group data:", error);
    return { error: "Failed to fetch group data" };
  }
});
