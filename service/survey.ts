export async function survey(params: object) {
  const res: EmptyObjectType = await $fetch("/api/feedback/submit", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function upload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  // debug (safe)
  for (const [k, v] of formData.entries()) {
    console.log("FormData:", k, v);
  }

  const res = await $fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  if (res?.errcode !== 0) {
    throw new Error(res?.info || "Upload error");
  }

  return normalizeImageUrl(res.data!.url);
}

function normalizeImageUrl(url: string): string {
  // Already relative
  if (url.startsWith("/")) {
    return url;
  }

  try {
    const u = new URL(url);
    return u.pathname; // strips domain, keeps /image/...
  } catch {
    // fallback (should not happen)
    return url;
  }
}
