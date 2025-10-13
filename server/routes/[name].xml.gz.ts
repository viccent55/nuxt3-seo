import { defineEventHandler, getRouterParam, setHeader, sendStream } from 'h3'
import { Readable } from 'stream'

export default defineEventHandler(async (event) => {
  let name: string | undefined;
  try {
    // The router parameter is named 'name.xml.gz' due to the filename.
    const nameWithExt = getRouterParam(event, 'name.xml.gz')
    name = nameWithExt?.replace('.xml.gz', '')
    // Basic validation
    if (!name) {
      event.node.res.statusCode = 400
      return 'Missing sitemap name'
    }

    const allowed = ['sitemap', 'actor', 'subject', 'tags']
    if (!allowed.includes(name)) {
      event.node.res.statusCode = 404
      return 'Invalid sitemap file'
    }

    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase 
    const fileUrl = `${apiBase.replace(/\/apiv1$/, '')}/${name}.xml.gz`

    const response = await fetch(fileUrl)

    if (!response.ok) {
      console.error(`[Sitemap] Upstream fetch failed with status: ${response.status} for ${fileUrl}`)
      event.node.res.statusCode = response.status
      return `Failed to fetch ${fileUrl}`
    }

    if (!response.body) {
      console.error(`[Sitemap] Upstream response body is empty for ${fileUrl}`)
      event.node.res.statusCode = 500
      return 'Empty response body from upstream API'
    }

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Content-Encoding', 'gzip')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return sendStream(event, Readable.fromWeb(response.body as any))
  } catch (error) {
    console.error(`[Sitemap] Unexpected error for name ${name}:`, error)
    event.node.res.statusCode = 500
    return 'Internal Server Error'
  }
})