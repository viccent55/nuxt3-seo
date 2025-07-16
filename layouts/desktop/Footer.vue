<script lang="ts" setup>
  const links = ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"];
</script>

<template>
  <v-container
    fluid
    class="bg-background pa-0"
  >
    <v-container class="bg-none">
      <div class="d-flex flex-column justify-start">
        <v-row dense>
          <v-col
            cols="12"
            md="7"
          >
            <div class="d-flex flex-wrap flex-grow-1 ga-3 ga-md-8">
              <span>用户投稿</span>
              <span>商务合作</span>
              <span>加入我们</span>
              <span>关于我们</span>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="5"
          >
            <div class="d-flex justify-end ga-3">
              <v-icon size="large">mdi-wechat</v-icon>
              <v-icon size="large">mdi-wechat</v-icon>
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <div class="d-flex flex-wrap flex-grow-1 ga-3 ga-md-5 align-center">
              <div>用户投稿</div>
              <div class="d-flex ga-md-5 flex-grow-1 ga-3 text-caption">
                <span>商务合作</span>
                <span>加入我们</span>
                <span>商务合作</span>
                <span>加入我们</span>
                <span>关于我们</span>
                <span>关于我们</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <v-footer class="d-flex justify-center flex-wrap flex-grow-1">
      <v-sheet class="pa-4">
        Copyright@山东裕玩具有限公司版权所有|鲁ICP备16039348号公安备案号：37021302000181
      </v-sheet>
    </v-footer>
  </v-container>
</template>
