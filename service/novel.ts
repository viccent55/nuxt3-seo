export async function getCategories(param: object) {
  const res: EmptyObjectType = await $fetch("/api/novel/categories", {
    method: "POST",
    body: dataEncrypt(param),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function getCategoryList(params: object) {
  const res: EmptyObjectType = await $fetch("/api/novel/list", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function getCategoryDetail(params: object) {
  const res: EmptyObjectType = await $fetch("/api/novel/detail", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
