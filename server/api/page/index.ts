export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const result = await $fetch(`${config.public?.apiBase}/home/page/contact`);

    return result; // Return the fetched result
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching page data:", error);
    return { error: "Failed to fetch page data" };
  }
});
