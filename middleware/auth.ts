import { useAuthStore } from "@/store/auth"

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.token && to.path !== '/login') {
    return navigateTo('/login')
  }
})