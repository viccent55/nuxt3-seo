// plugins/pwa.client.ts

export default defineNuxtPlugin(() => {
  if (process.server) return

  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
  const isInStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone

  let deferredPrompt: any = null

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt = e
    console.log('[PWA] Install prompt saved.')

    // Automatically prompt the user (you can comment this if you want it silent)
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult: any) => {
      console.log(`[PWA] User response: ${choiceResult.outcome}`)
      deferredPrompt = null
    })
  })

  if (isIos && !isInStandalone) {
    console.log('[PWA] iOS user — show instructions manually.')
    // Optionally show a banner or toast here
  }

  console.log('[PWA] Init done.')
})
