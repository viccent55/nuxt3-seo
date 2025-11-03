<script setup lang="ts">
  import { onMounted } from "vue";
  import { useChatWidget } from "~/composables/useChatWidget";

  const { loadAndInitialize } = useChatWidget();

  onMounted(() => {
    loadAndInitialize({
      API_URL: "http://live.xhltfes.com",
      AGENT_ID: "agent",
      USER_ID: "",
      USER_NAME: "小红书",
    });
  });
</script>

<template>
  <div>
    <!-- <h1>Welcome to my site!</h1> -->
  </div>
</template>
