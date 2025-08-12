<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });

  const user = {
    name: "人物名称",
    vip: true,
    bio: "这个人什么都没有写",
    wallet: 159.0,
  };

  const menuItems = [
    {
      icon: "mdi-wallet-outline",
      label: "我的钱包",
      value: `¥${user.wallet.toFixed(2)}`,
      route: "/dashboard/profile",
    },
    {
      icon: "mdi-lock-outline",
      label: "我的投稿",
      route: "/dashboard/security",
    },
    {
      icon: "mdi-bell-outline",
      label: "我的消息",
      route: "/dashboard/subscribe",
    },
    {
      icon: "mdi-bookmark-outline",
      label: "我的收藏",
      route: "/dashboard/record",
    },
    {
      icon: "mdi-message-text-outline",
      label: "意见反馈",
      route: "/dashboard/message",
    },
    {
      icon: "mdi-cog",
      label: "设置",
      route: "",
    },
  ];
</script>

<template>
  <v-container
    fluid
    class="pa-0"
  >
    <!-- Profile Header -->
    <v-card
      flat
      class="pa-4 d-flex align-center"
    >
      <!-- Avatar -->
      <v-avatar
        size="64"
        color="grey-lighten-2"
      >
        <!-- Replace with <v-img src="..."/> -->
      </v-avatar>

      <!-- Info -->
      <div class="ml-4 flex-grow-1">
        <div class="d-flex align-center">
          <span class="text-subtitle-1 font-weight-medium">
            {{ user.name }}
          </span>
          <v-chip
            v-if="user.vip"
            label
            size="x-small"
            color="yellow"
            text-color="white"
            class="ml-2"
          >
            VIP
          </v-chip>
        </div>
        <div class="text-caption text-grey mt-1">{{ user.bio }}</div>
      </div>
    </v-card>

    <!-- Menu List -->
    <v-card
      flat
      class="mt-3"
    >
      <v-list
        lines="one"
        density="comfortable"
      >
        <template
          v-for="(item, index) in menuItems"
          :key="index"
        >
          <v-list-item
            :prepend-icon="item.icon"
            :title="item.label"
            :to="item.route"
          >
            <template #append>
              <div
                v-if="item.value"
                class="text-grey mr-2 text-body-2"
              >
                {{ item.value }}
              </div>
              <v-icon
                icon="mdi-chevron-right"
                size="small"
                class="text-grey"
              ></v-icon>
            </template>
          </v-list-item>

          <!-- Divider except after last item -->
          <v-divider v-if="index < menuItems.length - 1" />
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>
