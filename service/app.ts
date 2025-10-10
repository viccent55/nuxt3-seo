export async function pwaInstalled(params: object) {
  const res: EmptyObjectType = await $fetch("/api/app/pwa", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function firstVisitInApp(params: object) {
  const res: EmptyObjectType = await $fetch("/api/app/firstVisitInApp", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
