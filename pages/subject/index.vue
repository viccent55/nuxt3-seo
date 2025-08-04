<script lang="ts" setup>
  useSeo({});
  const { data, pending, error } = await useAsyncData<ApiResponse>(
    "subject",
    async () => {
      const res = await $fetch<EmptyObjectType>("/api/subject/latest", {
        method: "POST",
        body: {
          with_actor: 1,
          with_post: 1,
          page: 1,
          limit: 30,
        },
      });
      return {
        items: res.data?.items || [],
        count: res.data?.count || 0,
      };
    }
  );
  const { isMobile } = useVariable();
</script>
<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-6">专题</h2>
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in data?.items"
        :key="index"
      >
        <v-hover v-slot="{ isHovering, props }">
          <NuxtLink
            :to="`/subject/detail/${item.id}`"
            class="text-decoration-none"
          >
            <v-sheet
              v-bind="props"
              flat
              class="pa-5 cursor-pointer rounded"
              :class="isHovering ? 'hover-shadow' : 'bg-none'"
              tag="article"
              color="surface"
              min-height="300"
            >
              <v-row dense>
                <v-col
                  cols="4"
                  sm="3"
                >
                  <Image
                    :src="item.cover"
                    cover
                    :width="isMobile ? '120' : '120'"
                    :height="isMobile ? '100' : '120'"
                  >
                    <v-row class="chip-top-left">
                      <div
                        v-for="(item, index) in ['热点', '推荐', '经典']"
                        :key="index"
                        class="d-flex ga-1 mb-1"
                      >
                        <v-chip
                          :color="
                            index == 0
                              ? 'primary'
                              : index == 1
                                ? 'green'
                                : 'error'
                          "
                          flat
                          size="x-small"
                          variant="flat"
                          class="rounded-0 mx-1"
                        >
                          {{ item }}
                        </v-chip>
                      </div>
                    </v-row>
                  </Image>
                </v-col>
                <v-col
                  cols="8"
                  sm="9"
                  class="d-flex flex-column justify-between pl-md-4 pl-2"
                >
                  <div>
                    <h3 class="text-subtitle-1 font-weight-medium mb-1">
                      {{ item.name }}
                    </h3>
                    <div class="text-body-2 text-grey-darken-1 mb-2 truncate-3">
                      {{ item.intro }}
                    </div>
                  </div>
                  <div
                    class="d-flex align-center scroll-x text-grey mb-1 ga-2 align-center"
                  >
                    <div
                      class="f11 font-weight-bold"
                      style="min-width: 55px"
                    >
                      相关文章：
                    </div>
                    <div v-for="(iten, index) in item.actors">
                      <NuxtLink
                        @click.stop
                        :to="`/actor/detail/${iten.id}`"
                        class="text-decoration-none text-grey"
                      >
                        <v-chip
                          v-if="iten.name"
                          size="x-small"
                          class="text-capitalize"
                          :key="index"
                        >
                          {{ iten.name }}
                        </v-chip>
                      </NuxtLink>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-divider class="my-2" />
                  <v-row dense>
                    <v-col
                      cols="6"
                      v-for="post in item.posts"
                      :key="post.id"
                    >
                      <NuxtLink
                        :to="`/article/${post.id}`"
                        class="text-decoration-none"
                      >
                        <div
                          class="d-flex align-center active-color cursor-pointer"
                        >
                          <v-icon
                            icon="mdi-circle-small"
                            size="small"
                            class="mr-1"
                          />
                          <div class="truncate-1 text-caption text-grey">
                            {{ post.title }}
                          </div>
                        </div>
                      </NuxtLink>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-sheet>
          </NuxtLink>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
  .chip-top-left {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 100;
    margin: 0;
    pointer-events: none;
  }
  .active-color:hover * {
    color: rgb(var(--v-theme-primary)) !important;
  }
</style>
