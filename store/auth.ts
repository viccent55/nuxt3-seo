// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useCookie('auth_token').value || null,
    baseURL: 'http://192.168.100.6:8088/apiv1'
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      useCookie('auth_token').value = token
    },
    clearToken() {
      this.token = null
      useCookie('auth_token').value = null
    },
    async $fetch(url: string, options: any = {}) {
      const headers = {
        ...options.headers,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
      }

      return $fetch(url, {
        baseURL: this.baseURL,
        ...options,
        headers
      })
    }
  }
})