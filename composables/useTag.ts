export default  function  useTag() {
  const route = useRoute();
  const {
    data: tagData,
    pending,
    error,
  } =  useAsyncData<EmptyObjectType>(
    () => `tag-group`,
    () =>
      $fetch("/api/tag/group", {
        method: "POST",
        body: {},
      }),
    {
      transform: (res: EmptyObjectType) => {
        return {
          ...res?.data,
        };
      },
    }
  );
  return {
    tagData,
    pending,
    error,
  };
}
