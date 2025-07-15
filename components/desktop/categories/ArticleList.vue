<template>
  <v-card
    v-for="i in 2"
    :key="i"
    class="d-flex mb-4"
  >
    <v-img
      src="https://via.placeholder.com/160"
      width="160"
      height="100%"
      cover
    />
    <v-card-text>
      <v-chip color="blue-lighten-4" label small>文章分类</v-chip>
      <div class="text-subtitle-1 font-weight-medium mt-1">
        某体育赛事爆冷门，冠军军首轮出局
      </div>
      <div class="text-caption mt-1 text-grey">
        这是描述文字的一部分，介绍文章内容...
      </div>
      <div class="d-flex align-center mt-2 text-grey text-caption">
        👁️ 12,341&nbsp;&nbsp;&nbsp;💬 324&nbsp;&nbsp;&nbsp;🕒 05-01 14:39
      </div>
    </v-card-text>
  </v-card>
</template>
