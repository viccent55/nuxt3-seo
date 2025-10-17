import { getPositionAds } from "@/service/advert";
import { useStore } from "@/store";
import { firstVisitInApp } from "@/service/app";
import { generateCode } from "@/utils/toolsValidate";
import { newVisitor, activeVisitor } from "@/service/explore";
import { getMemberActive } from "@/service/user";
import useVariable from "./useVariable";
import { useLocalStorage } from "@vueuse/core";

export default function useHome() {
  const store = useStore();
  const { getTypeDevice, route, storeUser, isNativePlatform } = useVariable();

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

  const checkNewVisitor = async () => {
    if (!process.client) return;
    const deviceType = getTypeDevice();
    try {
      const param = route.query.chan || "";
      const urlParams = new URLSearchParams(window.location.search);
      const chan = String(urlParams.get("chan") || param);
      const cleanedChan = chan.replace(/\/+$/, "");
      const request = {
        visitor: storeUser.visitCode,
        chan: cleanedChan,
        platform: deviceType,
      };
      await newVisitor(request);
    } catch (e) {
      console.error(e);
    }
  };
  const getFirstVisitInApp = async () => {
    if (!process.client) return;
    const deviceType = getTypeDevice();
    const lastCalledKey = "lastGetFirstVisitInApp";
    const lastCalled = useLocalStorage<string>(lastCalledKey, null);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (
      !lastCalled.value ||
      now - parseInt(lastCalled.value, 10) > twentyFourHours
    ) {
      const param = route.query.chan || "";
      const urlParams = new URLSearchParams(window.location.search);
      const chan = String(urlParams.get("chan") || param);
      const cleanedChan = chan.replace(/\/+$/, "");
      const request = {
        chan: cleanedChan,
        visitor: storeUser.visitCode,
        type: deviceType,
      };
      store.chan = cleanedChan;
      await firstVisitInApp(request);
      lastCalled.value = now.toString();
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

  const generateVisitCode = () => {
    storeUser.visitCode = generateCode();
    if (!isNativePlatform.value) {
      checkNewVisitor();
    }
    if (isNativePlatform.value) {
      getFirstVisitInApp();
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
  return {
    generateVisitCode,
    initVisitor,
    getFirstVisitInApp,
    initAds,
  };
}
