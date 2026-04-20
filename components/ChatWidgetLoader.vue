<script setup lang="ts">
  import { onMounted } from "vue";
  import OverlayLoading from "./OverlayLoading.vue";
  import CryptoJS from "crypto-js";

  const { loadAndInitialize, showChat } = useChatWidget();

  const props = defineProps({
    user: {
      type: Object,
      default: () => ({}),
    },
  });
  const state = reactive({
    userInfo: {} as EmptyObjectType,
    loading: false,
  });
  const { storeUser } = useVariable();
  // const id = computed(() => Number(storeUser.useId));

  const onInitChat = async () => {
    const config = useRuntimeConfig();
    // const displayName = storeUser.isLogin
    //   ? storeUser.useId
    //   : storeUser?.visitCode;

    const userId = computed(() => {
      if (storeUser.userInfo.id) {
        return CryptoJS.MD5(String(storeUser.userInfo.id)).toString();
      }
      return storeUser.visitCode;
    });
    const visitor = {
      USER_ID: userId.value || "",
      VISITOR_NAME: storeUser.userInfo?.nickname,
      VISITOR_AVATAR: storeUser.userInfo?.avatar || "",
    };
    const visitorJson = JSON.stringify(visitor);
    const extra = encodeURIComponent(visitorJson);

    await loadAndInitialize({
      API_URL: config.public.apiChatWidget as string,
      GROUP_ID: "1",
      USER_ID: userId.value || "",
      USER_NAME: storeUser.userInfo?.nickname || "",
      USER_AVATAR: storeUser.userInfo?.avatar || "",
      AUTO_OPEN: false,
      EXTRA: extra,
    });
  };
  onMounted(async () => {
    // Only load script in background, but don’t show popup yet
  });

  defineExpose({
    open: async () => {
      // await getUser();
      await onInitChat();
      showChat();
    },
  });
</script>

<template>
  <div>
    <!-- <h1>Welcome to my site!</h1> -->
    <OverlayLoading v-model:model-value="state.loading" />
  </div>
</template>
<style>
  #chat-widget-button {
    display: none;
  }
</style>
