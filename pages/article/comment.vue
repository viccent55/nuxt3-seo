<template>
  <v-card
    class="pa-4"
    flat
    color="transparent"
  >
    <!-- Comment Header -->
    <h2 class="text-h6 mb-4">评论</h2>

    <!-- Comment Input -->
    <v-textarea
      v-model="commentText"
      auto-grow
      rows="4"
      label="欢迎留言讨论"
      variant="outlined"
    />

    <div class="text-right mb-6">
      <v-btn
        color="primary"
        elevation="0"
        @click="submitComment"
        width="100"
        size="small"
      >
        发布
      </v-btn>
    </div>

    <v-divider />
    <!-- Comment List -->
    <div v-if="data?.items?.length">
      <div
        v-for="(comment, index) in data?.items"
        :key="index"
        class="d-flex flex-column mt-4"
      >
        <div class="d-flex">
          <!-- Avatar -->
          <v-avatar
            size="40"
            class="mr-4"
            border
          >
            <Image
              v-if="comment.member?.avatar"
              :src="comment.member.avatar"
            />
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>

          <!-- Comment Content -->
          <div class="flex-grow-1">
            <div class="text-blue mb-1">
              {{ comment.member?.nickname || comment.member?.username }}
            </div>
            <div class="text-body-2 text-grey-darken-2 mb-1">
              {{ comment.text }}
            </div>
            <!-- <div class="text-caption text-grey-darken-1">{{ comment }}</div> -->

            <!-- Children Replies -->
            <div
              v-if="comment.children?.length"
              class="mt-4 d-flex"
            >
              <!-- Divider Line -->
              <v-divider
                vertical
                class="mr-2"
              />
              <!-- Child Comments -->
              <div class="flex-grow-1">
                <div
                  v-for="child in comment.children"
                  :key="child.id"
                  class="d-flex mb-4"
                >
                  <v-avatar
                    size="32"
                    class="mr-3"
                  >
                    <v-img
                      v-if="child.member?.avatar"
                      :src="child.member.avatar"
                    />
                    <v-icon v-else>mdi-account-circle</v-icon>
                  </v-avatar>

                  <div>
                    <div class="text-blue mb-1 text-caption">
                      {{ child.member?.nickname || "匿名用户" }}
                    </div>
                    <div class="text-body-2 text-grey-darken-2">
                      {{ child.text }}
                    </div>
                    <!-- <div class="text-caption text-grey-darken-1 mt-1">刚刚</div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <v-divider v-if="index < data?.items?.length - 1" />
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-grey text-body-2 mt-5"
    >
      暂无评论 ...
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { useStore } from "~/store";

  interface Member {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  }

  const route = useRoute();
  const commentText = ref("");
  const snackbar = useSnackbar();
  const { data, refresh } = await useFetch("/api/comment", {
    method: "POST",
    body: {
      id: route.params.id,
    },
    watch: [() => route.params.id],
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data,
      };
    },
  });

  onMounted(() => {});
  const store = useStore();
  const submitComment = async () => {
    if (!commentText.value.trim()) return;
    const access_token = useCookie("access_token");
    if (!access_token.value) {
      return snackbar.showSnackbar("请先登录!", "error", "center top");
    }
    try {
      const { data: commentRes } = await useApiFetch("/api/comment/post", {
        method: "POST",
        body: {
          pid: 0,
          post_id: route.params.id,
          text: commentText.value,
        },
      });
      if (commentRes?.value.errcode === 0) {
        refresh();
      }
      commentText.value = "";
    } catch (error) {
      console.log(error);
    }
  };
</script>
