import { dataEncrypt } from "~/utils/crypto";

export async function getPositionAds(position: number) {
  const res: EmptyObjectType = await $fetch(`/api/ads/${position}`, {
    method: "GET",
  });
  const item = decrypt(res?.data);
  return item;
}
export function adsClick(id: number) {
  return $fetch("/api/ads/adClick", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}
export function itemAdClick(id: number) {
  return $fetch("/api/ads/itemAdClick", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}
