<script setup lang="ts">
  import { onMounted } from "vue";
  import { getUserInfo } from "@/service/user";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import OverlayLoading from "./OverlayLoading.vue";

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
  const id = computed(() => Number(storeUser.useId));

  const getUser = async () => {
    checkPermissions(PERMISSION.User, async () => {
      state.loading = true;
      try {
        const res = await getUserInfo(id.value);
        state.userInfo = res.data;
      } catch (e) {
        console.log(e);
      } finally {
        state.loading = false;
      }
    });
  };
  const onInitChat = async () => {
    const config = useRuntimeConfig();
    const displayName = storeUser.isLogin
      ? `${storeUser.useId}|${storeUser.userInfo?.nickname}`
      : storeUser?.visitCode;
  
    await loadAndInitialize({
      API_URL: config.public.apiChatWidget as string,
      AGENT_ID: "agent",
      USER_ID: "",
      USER_NAME: displayName,
      AUTO_OPEN: false,
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
