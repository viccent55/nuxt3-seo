import { computed, type Ref } from "vue";
import { useStore } from "~/store";

export const useSeo = (
  title: Ref<string | undefined>,
  description: Ref<string | undefined>,
  keyword: Ref<string | undefined>
) => {
  const store = useStore();
  const { configuration } = storeToRefs(store);

  useHead({
    title: computed(() => title?.value || configuration.value?.name),
    meta: [
      {
        name: "author",
        content: computed(() => configuration.value?.name || ""),
      },
      {
        name: "description",
        content: computed(() => description?.value || ""),
      },
      {
        name: "keywords",
        content: computed(
          () => keyword?.value || ""
        ),
      },
    ],
  });
};
