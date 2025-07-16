// server/api/groups.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const result = await $fetch(`${config.public?.apiBase}/tag/group`, {
    method: "POST",
    body: {},
  });

  return result;
});
