export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const authorization = getHeader(event, "authorization");
  try {
    const result = await $fetch(`${config.public?.apiBase}/behavior/comment`, {
      method: "POST",
      body,
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
    });

    return result;
  } catch (error) {
    console.error("Error forwarding comment post:", error);
    return { error: "Failed to post comment" };
  }
});
