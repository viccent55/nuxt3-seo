export default defineEventHandler(async (event) => {
  const body = await readBody<{ refreshToken: string }>(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;
  return await $fetch(`${baseURL}/index/refreshToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + body.refreshToken,
    },
  });
});
