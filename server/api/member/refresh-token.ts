export default defineEventHandler(async (event) => {
  const body = await readBody<{ refreshToken: string }>(event);
  const config = useRuntimeConfig();

  return await $fetch(`${config.public.apiBase}/member/refreshToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + body.refreshToken,
    },
  });
});
