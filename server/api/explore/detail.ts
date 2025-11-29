export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const baseURL = import.meta.dev
    ? config.public.apiLocal // when running `npm run dev`
    : config.public.apiBase;

  const realUrl = `${baseURL}/item/${body?.id}/${body.code}`;
  const curlCmd = `curl -X GET "${realUrl}"`;
  console.warn("🐚 CURL Equivalent:", curlCmd);
  try {
    const result: EmptyObjectType = await $fetch(realUrl, {
      method: "GET",
    });
    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch  data" };
  }
});
