
export const useSeo = (item?: EmptyObjectType) => {
  useHead({
    title:
      item?.seo_title ||
      "Default Website Title",
    meta: [
      {
        name: "description",
        content:
          item?.seo_description ||
          
          "Default description.",
      },
      {
        name: "keywords",
        content:
          item?.seo_keywords ||
          "default, keywords, nuxt, vue",
      },
      {
        name: "author",
        content:
          item?.seo_title|| "Author Name",
      },
    ],
  });
};
