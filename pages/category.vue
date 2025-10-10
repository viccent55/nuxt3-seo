<script lang="ts" setup>
  import { useStore } from "~/store";

  definePageMeta({
    keepalive: true,
  });

  const store = useStore();
``
  const { configuration, channel } = storeToRefs(store);
  const indexChannel = ref<string>(channel.value);
  const categories = computed(() => [
    { name: "发现", value: "001" },
    ...(configuration.value.categories || []).map((item: EmptyObjectType) => ({
      name: item.name,
      value: item.id,
    })),
  ]);
</script>

<template>
  <v-container
    class="pa-0"
    fluid
  >
    <ExploreChannelBar
      :items="categories"
      :active-value="indexChannel"
      @click-item="(v: EmptyObjectType) => (indexChannel = v.value)"
    />
    <NuxtPage />
  </v-container>
</template>
<style scoped lang="scss"></style>
