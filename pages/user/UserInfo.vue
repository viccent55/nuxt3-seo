<script setup lang="ts">
  import FollowButton from "@/components/global/FollowButton.vue";
  import Dialog from "./Dialog.vue";
  import type { UserDetailInfo } from "@/types/info";
  import { useUserStore } from "@/store/user";
  import { computed } from "vue";
  import Image from "@/components/Image.vue";
  import { screenMode } from "@/hooks/useScreenMode";

  import useVariable from "@/composables/useVariable";
  import { getCurrentDomain } from "@/service";

  const props = defineProps<{ user: UserDetailInfo }>();
  const emits = defineEmits(["click-follow", "click-report", "refresh"]);
  const userStore = useUserStore();
  const { onCopy } = useVariable();
  const snackbar = useSnackbar();

  const self = computed(() => userStore.useId === props.user.id);

  const gravatarUrl = computed(() => {
    return `/icons/icon-128.webp`;
  });

  function clickFollow() {
    emits("click-follow", props.user);
    props.user.isFollow = !props.user.isFollow;
  }

  const onCopyUsername = async () => {
    const url = `${getCurrentDomain()}/user/${props.user.id}`;
    await onCopy(url);
    snackbar.showSnackbar("用户名已复制！", "success");
  };
</script>

<template>
  <v-card
    flat
    class="pa-4 w-100"
    rounded="xl"
  >
    <div
      class="d-flex align-start"
      style="max-width: 800px; margin: auto"
    >
      <!-- Avatar -->
      <div class="mr-md-5 mr-2">
        <v-avatar
          :size="screenMode === 'phone' ? 80 : 120"
          class="elevation-2"
        >
          <template v-if="props.user.avatar">
            <Image
              :src="props.user.avatar"
              fit="cover"
              height="100%"
              width="100%"
            />
          </template>
          <template v-else>
            <v-img
              :src="gravatarUrl"
              cover
            />
          </template>
        </v-avatar>
      </div>

      <!-- Basic Info -->
      <div class="flex-grow-1">
        <div class="d-flex flex-column">
          <div>
            <div class="text-h6 font-weight-bold">
              {{ props.user.nickname }}
            </div>
            <div class="text-body-2 d-flex align-center mt-1">
              小红书号: {{ props.user.invite_code }}
              <v-icon
                size="small"
                class="ml-1 cursor-pointer"
                color="primary"
                @click="onCopyUsername"
              >
                mdi-content-copy
              </v-icon>
            </div>
          </div>

          <div class="mt-3 text-body-2 text-grey-darken-1">
            {{ props.user.slogan || "还没有简介" }}
          </div>

          <!-- Interactions -->
          <div class="d-flex ga-5 mt-4">
            <div class="text-center">
              <div class="text-subtitle-1 font-weight-medium">
                {{ props.user.subscribed }}
              </div>
              <div class="text-caption text-grey">关注</div>
            </div>
            <div class="text-center">
              <div class="text-subtitle-1 font-weight-medium">
                {{ props.user.inviter }}
              </div>
              <div class="text-caption text-grey">粉丝</div>
            </div>
            <div class="text-center">
              <div class="text-subtitle-1 font-weight-medium">
                {{ props.user.invite_count }}
              </div>
              <div class="text-caption text-grey">获赞与收藏</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="d-flex flex-column align-end ml-5">
        <Dialog
          :user="props.user"
          :self="self"
          @refresh="() => emits('refresh')"
        />

        <FollowButton
          v-if="!self"
          :is-follow="props.user.isFollow"
          class="mt-2"
          @click="clickFollow"
        />
      </div>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
  .info-wrapper {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
