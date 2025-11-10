<script lang="ts" setup>
  import { getInvitedLogs } from "~/service/user";

  const state = reactive({
    isOpen: false,
    data: [] as EmptyArrayType[],
    loading: false,
    isNomore: false,
    isLoadmore: false,
    page: 1,
    limit: 30,
    currentType: "note",
  });

  const { isMobile } = useVariable();

  const getInvites = async () => {
    try {
      const res = await getInvitedLogs({
        page: state.page,
        limit: state.limit,
      });
      state.data = res.data;
      console.log("console.log", res);
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };

  defineExpose({
    open: () => {
      state.isOpen = true;
      getInvites();
    },
  });
</script>

<template>
  <v-dialog
    v-model="state.isOpen"
    scrollable
    :fullscreen="isMobile"
    max-width="1200"
  >
    <v-card>
      <v-card-title class="pb-0">
        <v-btn
          icon="mdi-chevron-left"
          flat
          density="comfortable"
          @click="state.isOpen = false"
          style="position: absolute; top: 10px; left: 10px"
        >
          <v-icon></v-icon>
        </v-btn>
        <!-- Title -->
        <div class="text-center text-md-h6 mb-2">邀请记录</div>
      </v-card-title>

      <v-card-text class="px-4 pt-0">
        <div
          class="page-wrapper"
          ref="pageWrapperRef"
        >
          testing 001
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
