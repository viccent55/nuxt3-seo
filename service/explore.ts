import { decrypt, dataEncrypt } from "~/utils/crypto";

export async function newVisitor(params: object): Promise<EmptyObjectType> {
  const res: EmptyObjectType = $fetch("/api/explore/newVisitor", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

// Active Visitor
export async function activeVisitor(params: object): Promise<EmptyObjectType> {
  const res: EmptyObjectType = await $fetch("/api/explore/newVisitor", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function getExploreFeeds(
  params: object
): Promise<EmptyObjectType> {
  const res: EmptyObjectType = await $fetch("/api/explore/feed", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function comments(params: object) {
  const res: EmptyObjectType = await $fetch("/api/explore/comments", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function like(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/like", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function collect(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/collect", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function follow(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/follow", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}
export async function reply(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/comment", {
    method: "POST",
    body: dataEncrypt(params),
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function detail(params: EmptyObjectType) {
  const res: EmptyObjectType = await $fetch("/api/explore/detail", {
    method: "POST",
    body: params,
  });
  if (res.data) return decrypt(res.data);
  return res;
}

export async function search(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/search", {
    method: "POST",
    body: dataEncrypt(params),
  });
  console.log(res);
  if (res.data) return decrypt(res.data);
  return res;
}
