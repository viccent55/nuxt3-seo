<script lang="ts" setup>
  import { getInvitedLogs } from "~/service/user";

  const props = defineProps({
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  });
  const state = reactive({
    isOpen: false,
    data: {} as EmptyObjectType,
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

  const invitedCount = 2;
  const remainingCount = 3;

  const inviteList = [
    {
      avatar: "/avatars/a1.jpg",
      name: "不吃鱼的小猫",
      date: "2025-10-24 10:55:30",
    },
    {
      avatar: "/avatars/a2.jpg",
      name: "不吃鱼的小猫",
      date: "2025-10-24 10:55:30",
    },
  ];
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
    max-width="750"
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
        <user-referralnfo :userInfo="props.userInfo" />
        <!-- Top Stats -->
        <v-row class="text-center my-5">
          <v-col cols="6">
            <div class="text-subtitle-2 mb-1">已邀请人数</div>
            <div class="text-h5 font-weight-bold">{{ invitedCount }}</div>
          </v-col>

          <v-divider
            vertical
            class="mx-2"
          />

          <v-col cols="5">
            <div class="text-subtitle-2 mb-1">还需邀请人数</div>
            <div class="text-h5 font-weight-bold">{{ remainingCount }}</div>
          </v-col>
        </v-row>

        <!-- Title -->
        <div class="text-subtitle-1 font-weight-bold mb-3">邀请记录</div>

        <!-- Invite List -->
        <v-row dense>
          <v-col
            v-for="(item, i) in inviteList"
            :key="i"
            cols="12"
            class="mb-2"
          >
            <v-card
              rounded="lg"
              color="surface"
              class="pa-3 d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center">
                <v-avatar
                  size="44"
                  class="me-3"
                >
                  <v-img :src="item.avatar" />
                </v-avatar>
                <span class="text-body-2">{{ item.name }}</span>
              </div>
              <span class="text-caption text-grey-lighten-1">
                {{ item.date }}
              </span>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
