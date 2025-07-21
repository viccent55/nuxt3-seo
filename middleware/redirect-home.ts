// middleware/redirect-home.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === "/home") {
    const { homeConfig } = useMenuCategories();
    const categorires = computed(() => homeConfig.value?.categories || []);
    await nextTick(); // or await load if using async
    if (categorires.value.length > 0) {
      return navigateTo("/home/" + categorires.value[0].name);
    }
  }
});
