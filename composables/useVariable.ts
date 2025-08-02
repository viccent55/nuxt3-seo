import { useWindowSize } from "@vueuse/core";

const useVaraible = () => {
  const { width } = useWindowSize();
  const isMobile = computed(() => width.value < 768);
  return {
    isMobile,
  };
};
export default useVaraible;
