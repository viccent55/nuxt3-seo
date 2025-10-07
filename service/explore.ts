import { decrypt, dataEncrypt } from "~/utils/crypto";

export function newVisitor(params: object): Promise<EmptyObjectType> {
  const respnse = $fetch("/api/explore/newVisitor", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return respnse;
}

// Active Visitor
export async function activeVisitor(params: object): Promise<EmptyObjectType> {
  const respnse: EmptyObjectType = await $fetch("/api/explore/newVisitor", {
    method: "POST",
    body: dataEncrypt(params),
  });
  return decrypt(respnse.data);
}

export async function getExploreFeeds(
  params: object
): Promise<EmptyObjectType> {
  const respnse: EmptyObjectType = await $fetch("/api/explore/feed", {
    method: "POST",
    body: dataEncrypt(params),
  });
  // console.log("respnse", decrypt(respnse.data))
  return decrypt(respnse.data);
}
export function getComments(id: string | number) {
  return $fetch("/api/ads/advert.ad.click", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}

export function like(id: string | number) {
  return $fetch("/api/ads/advert.ad.click", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}
export function search(id: string | number) {
  return $fetch("/api/ads/advert.ad.click", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}
