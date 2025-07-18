// middleware/redirect-home.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === "/home") {
    const { menuCategories } = useMenuCategories();
    await nextTick(); // or await load if using async
    if (menuCategories.value?.length > 0) {
      return navigateTo("/home/" + menuCategories.value[0].value);
    }
  }
});
