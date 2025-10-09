import { decrypt, dataEncrypt } from "~/utils/crypto";

export function newVisitor(params: object): Promise<EmptyObjectType> {
  const res: EmptyObjectType = $fetch("/api/explore/newVisitor", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return decrypt(res.data);
}

// Active Visitor
export async function activeVisitor(params: object): Promise<EmptyObjectType> {
  const res: EmptyObjectType = await $fetch("/api/explore/newVisitor", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return decrypt(res.data);
}

export async function getExploreFeeds(
  params: object
): Promise<EmptyObjectType> {
  const res: EmptyObjectType = await $fetch("/api/explore/feed", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return decrypt(res.data);
}
export async function getComments(id: string | number) {
  const res: EmptyObjectType = await $fetch("/api/explore/comments", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
  return decrypt(res.data);
}

export async function like(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/like", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return res;
}
export async function collect(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/collect", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return res;
}

export async function follow(params: object) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/follow", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return res;
}
export async function reply(params: EmptyObjectType) {
  const res: EmptyObjectType = await useApiFetch("/api/explore/comment", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return res;
}

export async function detail(params: EmptyObjectType) {
  const res: EmptyObjectType = await $fetch("/api/explore/detail", {
    method: "POST",
    body: params,
  });
  return decrypt(res.data);
}

// export function search(id: string | number) {
//   return $fetch("/api/ads/advert.ad.click", {
//     method: "POST",
//     body: dataEncrypt({ id }),
//   });
// }
