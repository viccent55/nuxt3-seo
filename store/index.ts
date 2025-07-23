import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => {
    return {
      lang: "en",
      ip: "",
      userInfos: {
        userName: "",
        profile: "",
        phone: "",
        uuid: "",
      },
      accessToken: false,
      onSearch: false,
      categories: [],
      themeColor: "#818CF8",
      timeStr: "",
      placeTypes: <EmptyArrayType>[],
      darkMode: "light",
      configuration: <EmptyObjectType>{},
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
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
