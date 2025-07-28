export const useVaraible = () => {
  const route = useRoute();
  const router = useRouter();
  const onNavigatoArticle = (id: number) => {
    // router.push(`${route.path == "/" ? "/home" : route.path}/article/${id}`);
  };
  return {
    onNavigatoArticle,
  };
};
export default useVaraible;
