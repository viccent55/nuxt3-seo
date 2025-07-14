import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "desktop" | "desktop-footer" | "desktop-header" | "mobile" | "mobile-header"
declare module 'nuxt/app' {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}