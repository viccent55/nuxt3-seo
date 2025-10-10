import { computed, type Ref } from "vue";

export const useSeo = (
  title: Ref<string | undefined>,
  description: Ref<string | undefined>,
  keyword: Ref<string | undefined>,
  author: Ref<string | undefined> = computed(() => "")
) => {
  useHead({
    title: computed(() => title?.value || "Default Website Title"),
    meta: [
      {
        name: "author",
        content: computed(() => author?.value || "Default name."),
      },
      {
        name: "description",
        content: computed(() => description?.value || "Default description."),
      },
      {
        name: "keywords",
        content: computed(
          () => keyword?.value || "default, keywords, nuxt, vue"
        ),
      },
    ],
  });
};
