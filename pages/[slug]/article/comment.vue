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

    <v-divider class="mb-6" />

    <!-- Comment List -->
    <div v-if="data?.items?.length">
      <div
        v-for="(comment, index) in data?.items"
        :key="index"
        class="d-flex flex-column"
      >
        <div class="d-flex">
          <!-- Avatar -->
          <v-avatar
            size="40"
            class="mr-4"
          >
            <v-img
              v-if="comment.member?.avatar"
              :src="comment.member.avatar"
            />
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-avatar>

          <!-- Comment Content -->
          <div class="flex-grow-1">
            <div class="text-blue mb-1">
              {{ comment.member?.nickname || "匿名用户" }}
            </div>
            <div class="text-body-2 text-grey-darken-2 mb-1">
              {{ comment.text }}
            </div>
            <div class="text-caption text-grey-darken-1">刚刚</div>

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
                    <div class="text-caption text-grey-darken-1 mt-1">刚刚</div>
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
      class="text-grey text-body-2"
    >
      暂无评论
    </div>
  </v-card>
</template>

<script setup lang="ts">
  interface Member {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
  }

  interface Comment {
    id: number;
    pid: number;
    member_id: number;
    text: string;
    member: Member | null;
    children: Comment[];
  }
  const route = useRoute();
  const commentText = ref("");
  const comments = ref<Comment[]>([]);

  const { data, pending, error } = useFetch<EmptyObjectType>("/api/comment", {
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

  function submitComment() {
    if (!commentText.value.trim()) return;
    comments.value.unshift({
      id: Date.now(),
      pid: 0,
      member_id: 1,
      text: commentText.value,
      member: {
        id: 1,
        username: "testuser",
        nickname: "当前用户",
        avatar: "",
      },
      children: [],
    });
    commentText.value = "";
  }
</script>
