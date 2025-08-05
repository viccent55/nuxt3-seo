import { useWindowSize } from "@vueuse/core";
import { useStore } from "~/store";

const useVaraible = () => {
  const { width } = useWindowSize();
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const isMobile = computed(() => width.value < 768);
  return {
    isMobile,
    store,
    route,
    router,
  };
};
export default useVaraible;
