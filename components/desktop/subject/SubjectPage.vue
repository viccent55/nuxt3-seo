<script lang="ts" setup>
  definePageMeta({
    keepalive: true,
  });
  const { isMobile, store, goto, route } = useVariable();
  const state = reactive({
    data: [] as EmptyArrayType,
    page: {
      with_actor: 1,
      with_post: 1,
      page: 1,
      limit: 30,
    },
    total: 0,
  });
  const page = computed(() => Number(route.params.page) || 1);
  const { data: subjects } = await useAsyncData<any>(
    `subject-${page.value}`,
    () =>
      $fetch("/api/subject/latest", {
        method: "POST",
        body: {
          with_actor: 1,
          with_post: 1,
          page: page.value,
          limit: state.page.limit,
        },
      }),
    {
      watch: [page],
      transform: (res: EmptyObjectType) => {
        return {
          items: res.data.items || [],
          count: res.data.count || 0,
        };
      },
    }
  );
  watchEffect(() => {
    if (subjects?.value.items) {
      state.data = subjects.value.items ?? [];
      state.total = subjects.value.count ?? [];
    }
  });
</script>
<template>
  <v-container>
    <h2
      class="text-h6 font-weight-bold mb-6"
      id="subjects"
    >
      专题
    </h2>
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in state?.data"
        :key="index"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            :color="isHovering ? 'white' : 'transparent'"
            flat
            class="pa-5"
            min-height="230"
          >
            <NuxtLink
              class="text-decoration-none"
              :to="`/subject/${item.id}`"
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
                  ></Image>
                </v-col>
                <v-col
                  cols="8"
                  sm="9"
                  class="d-flex rlex-sm-row flex-column pl-md-4"
                >
                  <div class="d-flex align-center ga-2 mb-1">
                    <v-chip
                      v-if="item.hot_sort > 0"
                      color="primary"
                      flat
                      hide-details
                      size="x-small"
                      variant="flat"
                      class="rounded-0"
                    >
                      热点
                    </v-chip>
                    <v-chip
                      v-if="item.recommend_sort > 0"
                      color="green"
                      flat
                      hide-details
                      size="x-small"
                      variant="flat"
                      class="rounded-0"
                    >
                      推荐
                    </v-chip>
                    <v-chip
                      v-if="item.classic_sort > 0"
                      color="error"
                      flat
                      hide-details
                      size="x-small"
                      variant="flat"
                      class="rounded-0"
                    >
                      经典
                    </v-chip>
                    <h3
                      class="text-subtitle-1 font-weight-medium text-surface-variant"
                    >
                      {{ item.name }}
                    </h3>
                  </div>
                  <div class="text-body-2 text-grey-darken-1 mb-2 truncate-3">
                    {{ item.intro }}
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
                      :cols="item?.posts.length > 2 ? 6 : 12"
                      v-for="(post, index) in item.posts"
                      :key="post.id"
                    >
                      <NuxtLink
                        v-if="index < 4"
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
                            color="grey"
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
            </NuxtLink>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <DesktopPaginate
      :page="state.page.page"
      :total="state.total"
      :limit="state.page.limit"
      base-path="/subject_"
      @page-change="
        (p: number) => {
          goto('subjects');
        }
      "
    />
    <v-row class="mt-2">
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in store.advertisement?.POSITION_HOME_BOTTOM"
        :key="index"
      >
        <DesktopAdvertSlot :advert="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
  .active-color:hover * {
    color: rgb(var(--v-theme-primary)) !important;
  }
</style>
