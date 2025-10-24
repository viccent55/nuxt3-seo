import { useGlobalDialog } from "~/store/globalDialog";

export default function useArticleDetail() {
  const route = useRoute();
  const storeDialog = useGlobalDialog();
  const accessToken = useCookie("access_token");

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
        return {
          ...res?.data,
        };
      },
    }
  );

  const isLiked = ref(false);
  const onLikeArticle = async () => {
    if (!accessToken.value) {
      return storeDialog.onLogin();
    }
    try {
      await useApiFetch("/api/article/like", {
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
