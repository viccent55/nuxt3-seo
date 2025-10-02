import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      lang: "en",
      ip: "",
      categories: [],
      darkMode: "light",
      configuration: <EmptyObjectType>{},
      userInfo: {} as EmptyObjectType,
      advertisement: {} as EmptyObjectType,
      dbRouteName: "profile",
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
    setUserInfo(userinfo: EmptyObjectType) {
      this.userInfo = userinfo;
    },
    clearUserInfo() {
      this.userInfo = {};
    },
    async fetchMenuCategories() {
      try {
        const response = await $fetch<any>("/api/config", {
          method: "POST",
          body: {},
        });

        this.configuration = response?.data || {};
      } catch (error) {
        console.error("Failed to fetch config:", error);
      }
    },
    setAdvertisement(adsItems: Record<string, any>) {
      const mapping: Record<string, string> = {
        "1": "POSITION_HOME_LIST",
        "2": "POSITION_HOME_BOTTOM",
        "3": "POSITION_HOME_RIGHT",
        "4": "POSITION_HOME_POPUP",
        "5": "POSITION_DETAIL_AFTER_TITLE",
        "6": "POSITION_DETAIL_AFTER_CONTENT",
        "7": "POSITION_DETAIL_RIGHT",
        "8": "POSITION_DETAIL_RECOMMEND_APP",
      };

      Object.entries(adsItems).forEach(([key, value]) => {
        const mappedKey = mapping[key];
        if (mappedKey) {
          this.advertisement[mappedKey] = value;
        }
      });
    },
  },
  persist: [
    {
      pick: ["darkMode", "userInfo", "advertisement", "configuration"],
      storage: piniaPluginPersistedstate.localStorage(),
      key: "store",
    },
  ],
});
