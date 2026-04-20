import { getPositionAds } from "@/service/advert";
import { useStore } from "@/store";
import { activeVisitor } from "@/service/explore";
import { getMemberActive } from "@/service/user";
import useVariable from "./useVariable";
import { useLocalStorage } from "@vueuse/core";

export default function useHome() {
  const store = useStore();
  const { getTypeDevice, storeUser } = useVariable();

  const getAdsPosition = async (position = 1) => {
    const respnse: any = await getPositionAds(position);
    const data = respnse?.data ?? [];
    if (position === 1) {
      store.homePopupAds = data;
    } else if (position === 2) {
      store.recommendAds = data;
    } else if (position === 3) {
      store.detailAppAds = data;
    } else if (position === 4) {
      store.detailAds = data;
    } else if (position === 5) {
      store.homeAds = data;
    }
  };

  const getActiveUser = async () => {
    if (!process.client) return;

    try {
      const lastCalledKey = "activeTimeUser";
      const lastCalled = useLocalStorage<string>(lastCalledKey, null);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (storeUser.useId == -1) return;
      if (
        !lastCalled.value ||
        now - parseInt(lastCalled.value, 10) > twentyFourHours
      ) {
        const request = {
          mid: storeUser.useId,
          platform: getTypeDevice(),
        };
        await getMemberActive(request);
        lastCalled.value = now.toString();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const getActiveVisitor = async () => {
    if (!process.client) return;
    try {
      const lastCalledKey = "activeVisitor";
      const lastCalled = useLocalStorage<string>(lastCalledKey, null);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (
        !lastCalled.value ||
        now - parseInt(lastCalled.value, 10) > twentyFourHours
      ) {
        const request = {
          visitor: storeUser.visitCode,
          platform: getTypeDevice(),
        };
        await activeVisitor(request);
        lastCalled.value = now.toString();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const initVisitor = () => {
    getActiveVisitor();
    getActiveUser();
  };
  const initAds = () => {
    getAdsPosition(1);
    getAdsPosition(2);
    getAdsPosition(3);
    getAdsPosition(4);
    getAdsPosition(5);
  };
  const getPopupNotice = async () => {
    try {
      const response = await $fetch("/api/config/popupnotice", {
        method: "GET",
      });
      const item = decrypt(response?.data);
      store.popupNotice = item.data || {};
    } catch (error) {
      console.error("Failed to fetch config:", error);
    }
  };
  return {
    initVisitor,
    initAds,
    getPopupNotice,
  };
}
