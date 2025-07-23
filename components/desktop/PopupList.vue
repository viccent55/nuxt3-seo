<script lang="ts" setup>
  const state = reactive({
    dialog: {
      title: "人物名称",
      isShowDialog: false,
    },
    items: [] as EmptyArrayType,
    id: null as number | null,
    param: "",
    loading: false,
  });

  const getPopupItems = async () => {
    try {
      state.loading = true;
      let request = {};
      if (state.param === "subject") {
        request = {
          page: 1,
          limit: 30,
          sid: state.id,
        };
      }
      if (state.param === "actor") {
        request = {
          page: 1,
          limit: 30,
          aid: state.id,
        };
      }
      const response = await $fetch<EmptyObjectType>(
        `/api/${state.param}/filter`,
        {
          method: "POST",
          body: request,
        }
      );

      state.items = response?.data.items || [];
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      state.loading = false;
    }
  };

  const openDialog = (id: number, param: string) => {
    state.dialog.isShowDialog = true;
    state.id = id;
    state.param = param;
    getPopupItems();
  };
  defineExpose({
    openDialog,
  });
</script>

<template>
  <v-dialog
    v-model="state.dialog.isShowDialog"
    width="auto"
    scrollable
  >
    <v-card
      :loading="state.loading"
      max-width="1000"
      min-width="800"
      :title="state.dialog.title"
    >
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            v-for="(item, index) in state.items"
            :key="item.id"
          >
            <desktop-article-list
              :item="item"
              class="cursor-pointer"
              @click="$router.push(`/${state.param}/article/${item.id}`)"
              route-param="/home"
            />
            <v-divider
              class="my-2"
              v-if="index < state.items?.length - 1"
            ></v-divider>
          </v-col>
          <v-col
            cols="12"
            align="center"
            v-if="!state.items.length"
          >
            <div class="text-subtitle-1 py-5">没有数据显示...</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text="关闭"
          @click="state.dialog.isShowDialog = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
