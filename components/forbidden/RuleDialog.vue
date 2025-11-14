<script lang="ts" setup>
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";

  const props = defineProps({
    modelValue: Boolean,
  });

  const { router, storeUser } = useVariable();
  const emit = defineEmits(["update:modelValue", "select", "leave"]);
  const isVisible = computed({
    get: () => props.modelValue,
    set: (v) => emit("update:modelValue", v),
  });
  let inviteClicked = false;
  const onInvite = () => {
    checkPermissions(PERMISSION.User, () => {
      router.push(`/user/${storeUser.useId}`);
      inviteClicked = true;
      isVisible.value = false;
    });
  };
  watch(
    () => router.currentRoute,
    (val) => {
      if (val.value?.fullPath == "/forbidden") {
        if (storeUser.userInfo?.invite_count < 5 || !storeUser.isLogin)
          isVisible.value = true;
      }
    },
    {
      deep: true,
    }
  );
  const onLeave = () => {
    if (inviteClicked) {
      inviteClicked = false; // Reset flag for next time
      return; // Stop execution if invite was clicked
    }

    isVisible.value = false;
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
</script>
<template>
  <v-dialog
    v-model="isVisible"
    max-width="500px"
    @after-leave="onLeave"
  >
    <v-card>
      <v-card-text>
        <div class="text-center text-primary text-subtitle-1">
          全球禁区中心包含: 真实强奸，稀缺幼女，萝莉岛，N号房，缅北内
          幕，血腥战场，新冠真相，真实奸杀，封杀事件 累计资源超300W部视频
        </div>

        <div class="text-center text-warning my-4 text-subtitle-1">
          成功邀请5人后，将永久免费解锁
        </div>

        <v-btn
          color="primary"
          block
          rounded="xl"
          @click="onInvite"
        >
          立即邀请
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
