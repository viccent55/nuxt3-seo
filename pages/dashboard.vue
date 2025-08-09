<script setup lang="ts">
  definePageMeta({
    middleware: ["dashboard"],
    keepalive: true,
  });

  const { store, onCopy } = useVariable();

  const menuItems = [
    {
      name: "profile",
      label: "基本信息",
      value: "/dashboard/profile",
    },
    {
      name: "security",
      label: "安全设置",
      value: "/dashboard/security",
    },
    {
      name: "contribute",
      label: "我的投稿",
      value: "/dashboard/contribute",
    },
    {
      name: "message",
      label: "我的消息",
      value: "/dashboard/message",
    },
    {
      name: "subscription",
      label: "邮箱订阅",
      value: "/dashboard/subscription",
    },
    {
      name: "record",
      label: "消费记录",
      value: "/dashboard/record",
    },
  ];

  onMounted(() => {});
</script>

<template>
  <v-container class="container">
    <v-row>
      <!-- Sidebar -->
      <v-col
        cols="12"
        md="3"
        class="pa-4"
      >
        <v-card
          class="pa-4"
          flat
          color="surface"
        >
          <v-avatar
            size="80"
            class="mx-auto mb-4 d-flex justify-center"
          >
            <Image :src="store.userInfo?.avatar" />
          </v-avatar>
          <div class="text-center mb-2 font-weight-medium">
            {{ store.userInfo?.nickname || store.userInfo?.username }}
          </div>
          <div class="text-center text-caption text-grey mb-1">
            {{ store.userInfo?.referrer_code }}
            <v-btn
              density="compact"
              color="primary"
              variant="text"
              icon
              @click="onCopy(store.userInfo?.referrer_code)"
            >
              <v-icon size="18">mdi-content-copy</v-icon>
            </v-btn>
          </div>

          <div class="text-center">
            <v-chip
              color="orange"
              size="small"
              label
            >
              VIP
            </v-chip>
          </div>

          <v-divider class="my-4" />

          <v-list
            list
            dense
          >
            <v-list-item
              class="mb-2 text-center"
              v-for="item in menuItems"
              :key="item.name"
              @click="store.dbRouteName = item.name"
              :active-color="store.dbRouteName === item.name ? 'primary' : ''"
              rounded
              :to="item.value"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Main Content -->
      <v-col
        cols="12"
        md="9"
        class="pa-4"
      >
        <nuxt-page />
      </v-col>
    </v-row>
  </v-container>
</template>
