export default function useHome() {
  const { data: postFilter } = useApiFetch<ApiResponse>(
    "/api/home/post-filter",
    {
      method: "POST",
      body: {
        page: 1,
        limit: 5,
        field: "home",
      },
      transform: (res: EmptyObjectType) => {
        return {
          items: res.data.items || [],
          count: res.data.count || 0,
        };
      },
    }
  );
  const { data: actorFilter } = useApiFetch<ApiResponse>(
    "/api/home/actor-fitler",
    {
      method: "POST",
      body: {
        field: "hot",
        with_actor: 1,
        with_post: 1,
        page: 1,
        limit: 6,
      },
      transform: (res: EmptyObjectType) => {
        return {
          items: res.data.items || [],
          count: res.data.count || 0,
        };
      },
    }
  );
  const { data: subjectFilter } = useFetch<ApiResponse>(
    "/api/home/subject-filter",
    {
      method: "POST",
      body: {
        field: "hot",
        with_actor: 1,
        with_post: 1,
        page: 1,
        limit: 6,
      },
      transform: (res: EmptyObjectType) => {
        return {
          items: res.data.items || [],
          count: res.data.count || 0,
        };
      },
    }
  );
  const { data: tagTop } = useFetch<ApiResponse>("/api/home/tag-top", {
    method: "POST",
    body: {
      limit: 30,
    },
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data || [],
        count: res.data.length || 0,
      };
    },
  });
    const comments = [
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
    {
      text: "这里边有猫腻吧！炸了这么多次，马斯克是NASA领导亲儿子吗？",
      author: "yangdy",
      date: "12-21",
      article: "赢得美国航天局29亿美元合同，SpaceX...",
    },
  ];
  return {
    postFilter,
    actorFilter,
    subjectFilter,
    tagTop,
    comments,
  };
}
