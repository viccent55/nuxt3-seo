export async function select(param: object) {
  const res: EmptyObjectType = await $fetch("/api/forbidden/select", {
    method: "POST",
    body: param,
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function detail(params: object) {
  const res: EmptyObjectType = await $fetch("/api/forbidden/detail", {
    method: "POST",
    body: dataEncrypt(params),
  });

  if (res.data) return decrypt(res.data);
  return res;
}

export async function like(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/forbidden/like", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function collect(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/forbidden/favorite", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function getCategories() {
  const res: EmptyObjectType = await useApiFetch("/api/forbidden/category", {
    method: "GET",
  });

  if (res.data) return decrypt(res.data);
  return res;
}
