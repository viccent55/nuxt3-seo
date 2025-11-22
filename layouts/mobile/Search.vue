<script lang="ts" setup>
  import Index from "~/pages/dashboard/subscription/index.vue";

  const state = reactive({
    items: [] as any[],
    loading: false,
    search: "",
    isSearchOpen: false,
  });
  let debounceTimer: NodeJS.Timeout;

  const fetchSearchResults = async () => {
    try {
      state.loading = true;
      const response: EmptyObjectType = await $fetch("/api/home/search", {
        method: "POST",
        body: { keyword: state.search },
      });
      state.items = response.data.items || [];
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };

  fetchSearchResults();
  watch(
    () => state.search,
    (newValue) => {
      clearTimeout(debounceTimer);
      if (newValue && newValue.trim() !== "") {
        state.loading = true;
        debounceTimer = setTimeout(() => {
          fetchSearchResults();
        }, 500);
      } else {
        state.items = [];
        state.loading = false;
      }
    }
  );
  const onGotoArticle = (item: EmptyObjectType) => {
    state.isSearchOpen = false;
    state.search = "";
    navigateTo(`/article/${item.id}`);
  };
  defineExpose({
    open: () => {
      state.isSearchOpen = true;
    },
    close: () => {
      state.isSearchOpen = false;
    },
  });
</script>
<template>
  <v-dialog
    v-model="state.isSearchOpen"
    min-height="40%"
    max-height="80%"
    scrollable
  >
    <v-card
      flat
      elevation="0"
      color="surface"
      class="pa-5"
    >
      <v-card-title class="px-2">
        <v-text-field
          v-model="state.search"
          :loading="state.loading"
          color="primary"
          hide-details
          density="compact"
          variant="outlined"
          placeholder="请输入搜索内容"
          prepend-inner-icon="mdi-magnify"
          rounded="lg"
          clearable
        />
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list lines="one">
          <v-list-item
            v-for="(item, index) in state.items"
            :key="index"
            @click="onGotoArticle(item)"
          >
            <span class="text-body-2 truncate-1 my-0 py-0">
              {{ item.title }}
            </span>
          </v-list-item>
        </v-list>
        <div
          v-if="!state.items.length"
          class="pa-2 text-body-1"
        >
          {{ state.search ? "没有找到结果" : "请输入关键词开始搜索" }}
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style lang="scss"></style>
