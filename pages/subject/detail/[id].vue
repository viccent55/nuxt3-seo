<script lang="ts" setup>
  import Breadcrumbs from "~/components/desktop/Breadcrumbs.vue";
  
  const { subjectData, postSubjectData } = useSubject();
  const route = useRoute()
  const breadcrumb = computed(() => {
    return [
      {
        text: "首页",
        href: "/",
      },
      {
        text: "专题",
        href: "/subject",
      },
      {
        text: subjectData.value?.name,
        disabled: true,
      },
    ];
  });
</script>

<template>
  <v-container>
    <Breadcrumbs :items="breadcrumb" />
    <h2 class="text-h6 font-weight-bold mb-4">专题</h2>
    <v-row>
      <!-- Left content -->
      <v-col
        cols="12"
        md="8"
      >
        <!-- Topic summary card -->
        <template
          v-for="(item, index) in postSubjectData?.items"
          :key="index"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              class="pa-4 mb-6"
              flat
              v-bind="props"
              :class="[
                'transition-fast-in-fast-out',
                isHovering ? 'bg-default' : 'bg-none',
              ]"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <Image
                    :src="item?.cover"
                    height="120px"
                    class="rounded-lg"
                    cover
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                >
                  <div>
                    <h3 class="truncate-1">{{ item?.title }}</h3>
                    <div class="text-caption mt-1 text-grey truncate-2">
                      {{ item?.intro }}
                    </div>
                  </div>
                  <v-row
                    no-gutters
                    class="mt-1"
                    align="center"
                  >
                    <v-col cols="4">
                      <v-row
                        dense
                        justify="start"
                        class="text-caption text-grey"
                      >
                        <v-col cols="12">
                          <div class="d-flex ga-4 align-center">
                            <div>
                              {{ useTimeAgo(item?.created) }}
                            </div>
                            <div class="d-flex ga-2">
                              <v-icon>mdi-eye</v-icon>
                              <span>{{ item?.view_count }}</span>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <div class="d-flex ga-4 align-center">
                            <div class="d-flex ga-2">
                              <v-icon>mdi-chat-outline</v-icon>
                              <span>{{ item?.comment_count }}</span>
                            </div>
                            <div class="d-flex ga-2">
                              <v-icon>mdi-thumb-up-outline</v-icon>
                              <span>{{ item?.like_count }}</span>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="8">
                      <v-row dense>
                        <v-col
                          cols="6"
                          v-if="item?.tags.length > 0"
                        >
                          <v-chip
                            v-for="(tag, index) in item?.tags"
                            :key="index"
                            size="x-small"
                            class="ma-1"
                            color="primary"
                            variant="tonal"
                            to="/tag"
                          >
                            {{ tag.name }}
                          </v-chip>
                        </v-col>
                        <v-col
                          cols="6"
                          v-if="item?.categories.length > 0"
                        >
                          <v-chip
                            v-for="(category, index) in item?.categories"
                            :key="index"
                            size="x-small"
                            class="ma-1"
                            variant="tonal"
                            to="/tag"
                          >
                            {{ category.name }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </template>
      </v-col>

      <!-- Right sidebar -->
      <v-col
        cols="12"
        md="4"
      >
        <!-- 人物名称 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">人物名称</h3>
        <v-card class="pa-4 mb-6 elevation-0">
          <div class="text-center">
            <v-avatar
              size="80"
              class="mx-auto mb-2"
            >
              <Image
                :src="subjectData?.cover"
                cover
              />
            </v-avatar>
            <p class="text-body-2 text-left trucate-2">
              {{ subjectData?.intro }}
            </p>
            <v-btn
              class="mt-2"
              size="small"
              variant="outlined"
              color="primary"
            >
              了解详情
            </v-btn>
          </div>
        </v-card>

        <!-- 涉及专题 -->
        <h3 class="text-subtitle-1 font-weight-medium mb-2">涉及专题</h3>
        <v-card
          class="pa-4"
          flat
        >
          <Image
            src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/01/Imperial-Bricks-Factory.jpg"
            height="160"
            contain
            class="rounded mb-4 mt-2"
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
