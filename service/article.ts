export async function articlList(param: object) {
  const res: EmptyObjectType = await $fetch("/api/article/select", {
    method: "POST",
    body: dataEncrypt(param),
  });
  return decrypt(res.data);
}
export async function detail(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/article/detail", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function comments(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/article/comments", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function like(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/article/like", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function collect(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/article/collect", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function comment(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/article/comment", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
