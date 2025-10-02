// useSnackbar.ts
import { inject } from 'vue'

export default function useSnackbar() {
  const showSnackbar = inject<(msg: string, color?: string, location?: string, timeout?: number) => void>('showSnackbar')

  if (!showSnackbar) {
    throw new Error('Snackbar composable is not provided')
  }
  return { showSnackbar }
}