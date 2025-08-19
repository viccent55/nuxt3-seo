import { useGlobalDialog } from "~/store/globalDialog";

export default function useArticleDetail() {
  const route = useRoute();
  const {
    data: articleDetail,
    pending,
    error,
  } = useAsyncData<EmptyObjectType>(
    () => `article-detail-${route.params.id}`,
    () =>
      $fetch("/api/article/detail", {
        method: "POST",
        body: {
          id: route.params.id,
        },
      }),
    {
      watch: [() => route.params.id],
      transform: (res: EmptyObjectType) => {
        useSeo({
          seo_title: res.data?.title,
          seo_keywords: res.data?.seo_keywords,
          home_description: res.data?.seo_description,
        });
        return {
          ...res?.data,
        };
      },
    }
  );
  useSeo({
    seo_title: articleDetail.value?.title,
    seo_keywords: articleDetail.value?.seo_keywords,
    home_description: articleDetail.value?.seo_description,
  });

  const storeDialog = useGlobalDialog();
  const accessToken = useCookie("access_token");

  const isLiked = ref(false);
  const onLikeArticle = async () => {
    if (!accessToken.value) {
      return storeDialog.onLogin();
    }
    try {
      const { data: response, error } = await useApiFetch("/api/article/like", {
        method: "POST",
        body: {
          id: route.params.id,
        },
      });
      isLiked.value = !isLiked.value;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const commentSection = ref();
  const onCommentClick = () => {
    if (!accessToken.value) {
      return storeDialog.onLogin();
    } else {
      // Scroll to the comment section
      commentSection.value?.$el?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const isCollected = ref(false);
  const onCollect = async () => {
    if (!accessToken.value) {
      return storeDialog.onLogin();
    }
    try {
      const response = await useApiFetch("/api/article/collect", {
        method: "POST",
        body: {
          id: route.params?.id,
        },
      });
      isCollected.value = !isCollected.value; // Toggle collection status
      // navigateTo("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const onViewCount = async () => {
    await useApiFetch("/api/article/view", {
      method: "POST",
      body: {
        id: route.params?.id,
      },
    });
  };
  return {
    articleDetail,
    pending,
    error,
    onLikeArticle,
    onCommentClick,
    onCollect,
    commentSection,
    onViewCount,
    isLiked,
    isCollected,
  };
}
