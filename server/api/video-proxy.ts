import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.url) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing url parameter",
    });
  }

  const targetUrl = String(query.url);

  function resolveUrl(base: string, path: string) {
    try {
      return new URL(path, base).toString();
    } catch {
      return path; // fallback
    }
  }
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        Referer: new URL(targetUrl).origin,
        Origin: new URL(targetUrl).origin,
      },
    });
    const contentType =
      res.headers.get("content-type") || "application/vnd.apple.mpegurl";
    // If playlist, rewrite segment and key URLs
    if (contentType.includes("application/vnd.apple.mpegurl")) {
      let text = await res.text();

      // Rewrite all absolute URLs (segments, keys)
      text = text.replace(/^((?!#).+)$/gm, (line) => {
        // skip comment lines starting with #
        if (line.startsWith("#")) return line;
        const absolute = resolveUrl(targetUrl, line);
        return `/api/video-proxy?url=${encodeURIComponent(absolute)}`;
      });
      // Rewrite key URIs in EXT-X-KEY
      text = text.replace(/URI="([^"]+)"/g, (match, keyPath) => {
        let absolute: string;

        if (keyPath.startsWith("http")) {
          absolute = keyPath;
        } else if (keyPath.startsWith("/")) {
          absolute = new URL(targetUrl).origin + keyPath;
        } else {
          const base = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);
          absolute = base + keyPath;
        }

        return `URI="/api/video-proxy?url=${encodeURIComponent(absolute)}"`;
      });

      return new Response(text, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // For all other resources including encrypt.key or .ts
    const buffer = Buffer.from(await res.arrayBuffer());
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType, // application/octet-stream or key MIME
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch resource",
    });
  }
});
