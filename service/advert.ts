export async function getPositionAds(position: number) {
  const res: EmptyObjectType = await $fetch(`/api/advert/${position}`, {
    method: "GET",
  });
  if (res.data) return decrypt(res?.data);
  return res;
}
export function adsClick(id: number) {
  return $fetch("/apiv1/ads/adClick", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}
export function itemAdClick(id: number) {
  return $fetch("/apiv1/ads/itemAdClick", {
    method: "POST",
    body: dataEncrypt({ id }),
  });
}
