<script lang="ts" setup>
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { useTawk } from "@/composables/useTawk";
  import { openLoginDialog } from "@/hooks/useLoginDialog";

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
  const onUnlock = () => {
    // console.log('onUnlock')
    emit('select')
  }

  watch(
    () => router.currentRoute,
    (val) => {
      if (val.value?.fullPath == "/anime") {
        if (storeUser.userInfo?.invite_count < 5 || !storeUser.isLogin)
          isVisible.value = true;
      }
    },
    {
      deep: true,
    }
  );
  // const onLeave = () => {
  //   if (inviteClicked) {
  //     inviteClicked = false; // Reset flag for next time
  //     return; // Stop execution if invite was clicked
  //   }

  //   isVisible.value = false;
  //   if (window.history.length > 1) {
  //     router.back();
  //   } else {
  //     router.push("/");
  //   }
  // };

const { openChat } = useTawk();
const onLivetalk = () => {
  if(!storeUser.isLogin){
    openLoginDialog()
    return 
  }
  openChat()
}

</script>
<template>
  <!---    @after-leave="onLeave" -->
  <v-dialog
    v-model="isVisible"
    max-width="500px"
  >
    <v-card>
      <v-card-text>
        <div class="text-center text-primary text-subtitle-1">
          全球禁区中心包含: 真实强奸，稀缺幼女，萝莉岛，N号房，缅北内
          幕，血腥战场，新冠真相，真实奸杀，封杀事件 累计资源超300W部视频
        </div>

        <div class="text-center text-warning my-4 text-subtitle-1">
          开通VIP 权限 可免费观看禁区。 并免定金约啪
        </div>
        <v-btn
          color="info"
          block
          rounded="xl"
          @click="onLivetalk"
        >
          联系客服 开通VIP权限
        </v-btn><br/>
        <v-btn
          color="primary"
          block
          rounded="xl"
          @click="onUnlock"
        >
          解锁观看
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
