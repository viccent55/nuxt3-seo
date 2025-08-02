import { useAuthStore } from "@/store/auth";

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
});
