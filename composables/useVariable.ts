import { useWindowSize } from "@vueuse/core";
import { useStore } from "~/store";

const useVaraible = () => {
  const { width } = useWindowSize();
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const isMobile = computed(() => width.value < 768);
  const onCopy = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
  };
  return {
    isMobile,
    store,
    route,
    router,
    onCopy,
  };
};
export default useVaraible;
