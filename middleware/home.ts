import useMenuCategories from "../composables/useMenuCategoies";

export default defineNuxtRouteMiddleware((to, from) => {
  const { menuCategories } = useMenuCategories();
  if (process.client) {
    if (to.path === "/home") {
      return navigateTo("/home/categories/" + menuCategories.value[0].value);
    }
  }
});
