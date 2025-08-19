import { useStore } from "~/store";

export default function useHome() {
  const { data: postFilter } = useFetch<ApiResponse>("/api/home/post-filter", {
    method: "POST",
    body: {
      page: 1,
      limit: 30,
      field: "home",
    },
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    },
  });
  const { data: actorFilter } = useFetch<ApiResponse>(
    "/api/home/actor-fitler",
    {
      method: "POST",
      body: {
        field: "hot",
        limit: 9,
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
        limit: 8,
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

  const POSITION_HOME_LIST = 1;
  const POSITION_HOME_BOTTOM = 2;
  const POSITION_HOME_RIGHT = 3;
  const { data: advertData } = useFetch<any>("/api/home/ads", {
    method: "POST",
    body: {
      positions: [
        POSITION_HOME_LIST,
        POSITION_HOME_BOTTOM,
        POSITION_HOME_RIGHT,
      ],
    },
  });
  const store = useStore();
  watchEffect(() => {
    if (advertData.value?.data) {
      const mapping: Record<number | string, string> = {
        [POSITION_HOME_LIST]: "POSITION_HOME_LIST",
        [POSITION_HOME_BOTTOM]: "POSITION_HOME_BOTTOM",
        [POSITION_HOME_RIGHT]: "POSITION_HOME_RIGHT",
      };

      const adsItems = advertData.value.data;

      // Ensure store.advertisement exists
      if (!store.advertisement) {
        store.advertisement = {};
      }

      for (const key in adsItems) {
        const mappedKey = mapping?.[key];
        if (mappedKey) {
          store.advertisement[mappedKey] = adsItems?.[key];
        }
      }
    }
  });
  return {
    postFilter,
    actorFilter,
    subjectFilter,
    tagTop,
    comments,
    store,
  };
}
