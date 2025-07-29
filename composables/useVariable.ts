const useVaraible = () => {
  const isMobile = computed(() => window?.innerWidth < 768);
  return {
    isMobile,
  };
};
export default useVaraible;
