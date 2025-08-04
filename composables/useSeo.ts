import { useStore } from "~/store/index";

export const useSeo = (item?: EmptyObjectType) => {
  const store = useStore();
  useHead({
    title:
      item?.seo_title ||
      store.configuration.home_title ||
      "Default Website Title",
    meta: [
      {
        name: "description",
        content:
          item?.seo_description ||
          store.configuration.home_description ||
          "Default description.",
      },
      {
        name: "keywords",
        content:
          item?.seo_keywords ||
          store.configuration.home_keywords ||
          "default, keywords, nuxt, vue",
      },
      {
        name: "author",
        content:
          item?.seo_title || store.configuration.home_author || "Author Name",
      },
    ],
  });
};
