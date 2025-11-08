<script setup lang="ts">
  import { onMounted } from "vue";
  const { loadAndInitialize, showChat } = useChatWidget();

  const emit = defineEmits(["update:loading"]);

  onMounted(async () => {
    // Only load script in background, but don’t show popup yet
    await loadAndInitialize({
      API_URL: "http://live.xhltfes.com",
      AGENT_ID: "agent",
      USER_ID: "",
      USER_NAME: "Viccent",
      AUTO_OPEN: false,
    });
  });

  defineExpose({
    open: async () => {
      showChat();
    },
  });
</script>

<template>
  <div>
    <!-- <h1>Welcome to my site!</h1> -->
  </div>
</template>
<style>
  #chat-widget-button {
    display: none;
  }
</style>
