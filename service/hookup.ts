export async function getConfig(param: object) {
  const res: EmptyObjectType = await $fetch("/api/hookup/config", {
    method: "POST",
    body: dataEncrypt(param),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function findList(params: object) {
  const res: EmptyObjectType = await $fetch("/api/hookup/list", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function detail(params: object) {
  const res: EmptyObjectType = await $fetch("/api/hookup/detail", {
    method: "POST",
    body: dataEncrypt(params),
  });

  if (res.data) return decrypt(res.data);
  return res;
}

export async function like(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/hookup/like", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function collect(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/hookup/collect", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
