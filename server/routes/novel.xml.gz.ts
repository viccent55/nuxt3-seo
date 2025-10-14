// server/routes/sitemap.xml.gz.ts
import { defineEventHandler, setHeader, sendStream } from 'h3'
import { Readable } from 'stream'

export default defineEventHandler(async (event) => {
  try {
    const cleanName = 'novel' // This route is now static

    const config = useRuntimeConfig()
    // The apiBase should be correctly populated now after our nuxt.config.ts fix
    const apiBase = config.public.apiBase 
    const fileUrl = `${apiBase.replace(/\/apiv1$/, '')}/${cleanName}.xml.gz`

    const response = await fetch(fileUrl)

    if (!response.ok) {
      console.error(`[Sitemap] Upstream fetch failed with status: ${response.status} for ${fileUrl}`)
      event.node.res.statusCode = response.status
      return `Failed to fetch ${fileUrl}`
    }

    if (!response.body) {
      console.error('[Sitemap] Upstream response body is empty.')
      event.node.res.statusCode = 500
      return 'Empty response body from upstream API'
    }

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Content-Encoding', 'gzip')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return sendStream(event, Readable.fromWeb(response.body as any))
  } catch (error) {
    console.error('[Sitemap] Unexpected error:', error)
    event.node.res.statusCode = 500
    return 'Internal Server Error'
  }
})
