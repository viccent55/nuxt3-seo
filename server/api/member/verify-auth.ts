export default defineEventHandler(async (event) => {
    // console.log('verifyAuth  defineEventHandler ... ');
    // const body = await readBody<{ refreshToken: string, uid: uid, auth: auth }>(event);
    const headers = getHeaders(event);
    const body = await readBody(event)
    const config = useRuntimeConfig();
    const baseURL = import.meta.dev
        ? config.public.apiLocal // when running `npm run dev`
        : config.public.apiBase;
    return await $fetch(`${baseURL}/member/verifyAuth`, {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/json",
            Authorization: headers.authorization!,
        },
    });
});
