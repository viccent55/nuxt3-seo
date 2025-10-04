import { defineStore } from "pinia";
import { decrypt } from "~/utils/crypto";

export const useStore = defineStore("store", {
  state: () => {
    return {
      lang: "en",
      ip: "",
      categories: [],
      darkMode: "light",
      configuration: <EmptyObjectType>{},
      localVersion: 0,
      homePopupAds: [] as EmptyArrayType,
      recommendAds: [] as EmptyArrayType,
      detailAppAds: [] as EmptyArrayType,
      detailAds: [] as EmptyArrayType,
      homeAds: [] as EmptyArrayType,
      dbRouteName: "profile",
      channel: "001",
      chan: "",
    };
  },
  actions: {
    updateLocale(lang: string) {
      this.lang = lang;
    },

    setCategories(categories: any) {
      this.categories = categories;
    },
    toggleTheme() {
      this.darkMode = this.darkMode === "dark" ? "light" : "dark";
    },
    setTheme(name: "light" | "dark") {
      this.darkMode = name;
    },
    async getConfiguration() {
      try {
        const response = await $fetch<any>("/api/config", {
          method: "GET",
          params: {},
        });
        const item = decrypt(response?.data);
        this.configuration = item.data || {};
      } catch (error) {
        console.error("Failed to fetch config:", error);
      }
    },
  },
  persist: [
    {
      pick: [
        "darkMode",
        "configuration",
        "homePopupAds",
        "recommendAds",
        "detailAppAds",
        "detailAds",
        "homeAds",
        "chan",
        "mode",
        "localVersion",
      ],
      storage: piniaPluginPersistedstate?.localStorage(),
      key: "store",
    },
  ],
});
