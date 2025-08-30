<script lang="ts" setup>
  const { isMobile, store, goto, route } = useVariable();
  const state = reactive({
    page: 1,
    limit: 30,
    total: 0,
    data: [] as EmptyArrayType,
  });

  const page = computed(() => route.params.page);
  const { data: actors } = await useAsyncData<any>(
    `actor-${page.value}`,
    () =>
      $fetch("/api/actor/latest", {
        method: "POST",
        body: {
          with_actor: 1,
          with_post: 1,
          page: page.value,
          limit: state.limit,
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
    if (actors?.value.items) {
      state.data = actors.value.items ?? [];
      state.total = actors.value.count ?? [];
    }
  });
</script>
<template>
  <v-container>
    <h2
      class="text-h6 font-weight-bold mb-6"
      id="actors"
    >
      人物
    </h2>
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in state.data"
        :key="index"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            flat
            class="pa-5 cursor-pointer rounded"
            :class="[isHovering ? 'bg-default' : 'bg-none']"
            min-height="230"
          >
            <NuxtLink
              :to="`/actor/${item.id}`"
              class="text-decoration-none"
            >
              <v-row dense>
                <v-col
                  cols="auto"
                  class="pr-md-4"
                >
                  <v-avatar :size="isMobile ? '70' : '120'">
                    <Image
                      :src="item.avatar"
                      cover
                    ></Image>
                  </v-avatar>
                </v-col>
                <v-col class="d-flex flex-column">
                  <div>
                    <h3
                      class="text-subtitle-1 font-weight-medium mb-1 text-surface-variant"
                    >
                      {{ item.name }}
                    </h3>
                    <div class="text-body-2 text-grey-darken-1 mb-2 truncate-3">
                      {{ item.intro }}
                    </div>
                  </div>
                  <div class="text-caption d-flex text-grey mb-1 d-flex ga-2">
                    <div v-for="(actor, index) in item?.actors">
                      <v-chip
                        v-if="actor.name"
                        :to="`/actor/detail/${actor.id}`"
                        size="x-small"
                        class="text-capitalize"
                        :key="index"
                        variant="text"
                      >
                        {{ actor.name }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-divider class="my-2" />
                  <v-row no-gutters>
                    <v-col
                      :cols="item?.posts.length > 2 ? (isMobile ? 12 : 6) : 12"
                      v-for="(post, index) in item.posts"
                      :key="post.id"
                    >
                      <v-chip
                        v-if="index < 4"
                        :to="`/article/${post.id}`"
                        color="transparent"
                        variant="text"
                        density="comfortable"
                        class="px-1"
                      >
                        <div
                          class="d-flex align-center active-color cursor-pointer w-100"
                        >
                          <v-icon
                            icon="mdi-circle-small"
                            size="small"
                            class="mr-1"
                            color="grey"
                          />
                          <div
                            class="text-caption text-grey truncate-1 flex-grow-1"
                          >
                            {{ post.title }}
                          </div>
                        </div>
                      </v-chip>
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
      :page="state.page"
      :total="state.total"
      :limit="state.limit"
      base-path="/actor_"
      @page-change="
        ($event) => {
          goto('actors');
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
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pagination-input :deep(.v-field) {
    height: 30px;
    min-height: 30px;
    width: 70px;
  }
  .pagination-input :deep(.v-field__input) {
    padding-top: 0;
    padding-bottom: 0;
    min-height: 30px;
  }
  .active-color:hover * {
    color: rgb(var(--v-theme-primary)) !important;
  }
</style>
