import { useAuthStore } from "@/store/auth"

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
 const accessToken = useCookie('access_token')
  if (!accessToken.value) {
    return navigateTo('/')
  }
})