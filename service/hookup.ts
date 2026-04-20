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
export async function getPointConfig(params: object = {}) {
  const res: EmptyObjectType = await useApiFetch("/api/hookup/point-config", {
    method: "GET",
    query: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function getBalance(params: object = {}) {
  const res: EmptyObjectType = await useApiFetch("/api/hookup/balance", {
    method: "GET",
    query: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function getLogs(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/hookup/logs", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function reedemPoint(params: object = {}) {
  const res: EmptyObjectType = await useApiFetch("/api/hookup/sign", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
