<script lang="ts" setup>
const { subjectData, postSubjectData } = useSubject();
</script>

<template>
  <v-container>
    <v-row>
      <!-- Left content -->
       {{ postSubjectData }}
      <v-col cols="12" md="8">
        <h2 class="text-h6 font-weight-bold mb-4">专题</h2>

        <!-- Topic summary card -->
        <v-card class="pa-4 mb-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-img
                src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/01/Imperial-Bricks-Factory.jpg"
                height="120px"
                class="rounded-lg"
              />
            </v-col>
            <v-col cols="12" md="8">
              <h3 class="text-h6">标题标题标题标题标题</h3>
              <p class="text-body-2">
                内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容…
              </p>
              <div class="d-flex align-center flex-wrap">
                <v-chip size="small" class="ma-1">热点</v-chip>
                <v-chip size="small" class="ma-1">推荐</v-chip>
                <v-chip size="small" class="ma-1">经典</v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Articles under topic -->
        <h3 class="text-h6 font-weight-bold mb-3">所属文章</h3>

        <v-card class="d-flex mb-4" tag="article">
          <v-img
            src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/01/Imperial-Bricks-Factory.jpg"
            width="160"
            cover
            class="rounded-l"
          />
          <div class="pa-4">
            <h4 class="text-subtitle-1 font-weight-medium">
              某体育赛事爆冷门，卫冕冠军首轮出局
            </h4>
            <div class="my-1">
              <v-chip size="x-small" class="me-2">社会热点</v-chip>
              <v-chip size="x-small" class="me-2">人物</v-chip>
            </div>
            <p class="text-body-2 text-grey-darken-1">
              在昨日进行的某国际体育赛事中，卫冕冠军意外不敌排名较低的对手，首轮即遭淘汰...
            </p>
            <div class="text-caption text-grey mt-2">
              👁️‍🗨️ 12,341 💬 324 🕒 05-01 14:39
            </div>
          </div>
        </v-card>

        <v-card class="d-flex mb-4" tag="article">
          <v-img
            src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/01/Imperial-Bricks-Factory.jpg"
            width="160"
            cover
            class="rounded-l"
          />
          <div class="pa-4">
            <h4 class="text-subtitle-1 font-weight-medium">
              某体育赛事爆冷门，卫冕冠军首轮出局
            </h4>
            <div class="my-1">
              <v-chip size="x-small" class="me-2">社会热点</v-chip>
              <v-chip size="x-small" class="me-2">人物</v-chip>
            </div>
            <p class="text-body-2 text-grey-darken-1">
              在昨日进行的某国际体育赛事中，卫冕冠军意外不敌排名较低的对手，首轮即遭淘汰...
            </p>
            <div class="text-caption text-grey mt-2">
              👁️‍🗨️ 12,341 💬 324 🕒 05-01 14:39
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right sidebar -->
      <v-col cols="12" md="4">
        <!-- 人物名称 -->
        <v-card class="pa-4 mb-6">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">人物名称</h3>
          <div class="text-center">
            <v-avatar size="80" class="mx-auto mb-2" />
            <p class="text-body-2">
              专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍专题介绍...
            </p>
            <v-btn class="mt-2" size="small" variant="tonal">了解详情</v-btn>
          </div>
        </v-card>

        <!-- 涉及专题 -->
        <v-card class="pa-4">
          <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
          <v-img
            src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/01/Imperial-Bricks-Factory.jpg"
            height="120"
            cover
            class="rounded mb-2"
          />
          <ul class="text-body-2 text-grey-darken-1 ps-4">
            <li>标题标题标题标题标题标题标题标题</li>
            <li>标题标题标题标题标题标题标题标题</li>
            <li>标题标题标题标题标题标题标题标题</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
