import { useStore } from "~/store";

export default function useHome() {
  const store = useStore();

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

  const POSITION_HOME_LIST = 1;
  const POSITION_HOME_BOTTOM = 2;
  const POSITION_HOME_RIGHT = 3;
  const POSITION_HOME_POPUP = 4;
  const POSITION_DETAIL_AFTER_TITLE = 5;
  const POSITION_DETAIL_AFTER_CONTENT = 6;
  const POSITION_DETAIL_RIGHT = 7;
  const POSITION_DETAIL_RECOMMEND_APP = 8;

  const getAllAds = async () => {
    const { data: advertData } = useFetch<any>("/api/home/ads", {
      method: "POST",
      body: {
        positions: [
          POSITION_HOME_LIST,
          POSITION_HOME_BOTTOM,
          POSITION_HOME_RIGHT,
          POSITION_HOME_POPUP,
          POSITION_DETAIL_AFTER_TITLE,
          POSITION_DETAIL_AFTER_CONTENT,
          POSITION_DETAIL_RIGHT,
          POSITION_DETAIL_RECOMMEND_APP,
        ],
      },
    });
    const mapping: Record<number | string, string> = {
      [POSITION_HOME_LIST]: "POSITION_HOME_LIST",
      [POSITION_HOME_BOTTOM]: "POSITION_HOME_BOTTOM",
      [POSITION_HOME_RIGHT]: "POSITION_HOME_RIGHT",
      [POSITION_HOME_POPUP]: "POSITION_HOME_POPUP",
      [POSITION_DETAIL_AFTER_TITLE]: "POSITION_DETAIL_AFTER_TITLE",
      [POSITION_DETAIL_AFTER_CONTENT]: "POSITION_DETAIL_AFTER_CONTENT",
      [POSITION_DETAIL_RIGHT]: "POSITION_DETAIL_RIGHT",
      [POSITION_DETAIL_RECOMMEND_APP]: "POSITION_DETAIL_RECOMMEND_APP",
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
  };
  getAllAds();

  const { data: comments } = useFetch<EmptyObjectType>(
    "/api/home/latest-comment",
    {
      method: "POST",
      body: {
        field: "hot",
        limit: 9,
      },
      transform: (res: EmptyObjectType) => {
        return {
          items: res.data || [],
          count: res.data.length || 0,
        };
      },
    }
  );
  return {
    postFilter,
    actorFilter,
    subjectFilter,
    tagTop,
    comments,
    store,
  };
}
