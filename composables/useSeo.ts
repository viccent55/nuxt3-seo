import { computed, type Ref } from "vue";

export const useSeo = (
  title: Ref<string | undefined>,
  description: Ref<string | undefined>,
  keyword: Ref<string | undefined>
) => {
  useHead({
    title: computed(() => title?.value || "Default Website Title"),
    meta: [
      {
        name: "description",
        content: computed(() => description?.value || "Default description."),
      },
      {
        name: "keywords",
        content: computed(() => keyword?.value || "default, keywords, nuxt, vue"),
      },
    ],
  });
};