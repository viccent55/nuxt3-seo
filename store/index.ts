import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      lang: "en",
      ip: "",
      onSearch: false,
      categories: [],
      themeColor: "#818CF8",
      timeStr: "",
      placeTypes: <EmptyArrayType>[],
      darkMode: "light",
      configuration: <EmptyObjectType>{},
      userInfo: {} as EmptyObjectType,
      menus: [
        {
          name: "首页",
          icon: "mdi-home-outline",
          value: "/",
        },
        {
          name: "专题",
          icon: "mdi-book-outline",
          value: "/subject",
        },
        {
          name: "人物",
          icon: "mdi-account-outline",
          value: "/actor",
        },
        {
          name: "分类",
          icon: "mdi-shape-outline",
          value: "/tag",
        },
      ],
      menusMobile: [
        {
          name: "首页",
          icon: "mdi-home-outline",
          value: "/",
        },
        {
          name: "专题",
          icon: "mdi-book-outline",
          value: "/subject",
        },
        {
          name: "人物",
          icon: "mdi-account-multiple-outline",
          value: "/actor",
        },
        {
          name: "分类",
          icon: "mdi-account-outline",
          value: "/dashboard",
        },
      ],
      advertisement: {} as EmptyObjectType,
      dbRouteName: 'profile',
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
    },
  ],
});
