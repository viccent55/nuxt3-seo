import { computed, type Ref } from "vue";
import { useStore } from "~/store";

export const useSeo = (
  title: Ref<string | undefined>,
  description: Ref<string | undefined>,
  keyword: Ref<string | undefined>
) => {
  const { configuration } = useStore();
  useHead({
    title: computed(() => title?.value || configuration.value?.website_name),
    meta: [
      {
        name: "description",
        content: computed(() => description?.value || ""),
      },
      {
        name: "keywords",
        content: computed(() => keyword?.value || ""),
      },
    ],
  });
};
