<script lang="ts" setup>
  useSeo({});

  const { isMobile, store, goto, route } = useVariable();
  const state = reactive({
    page: 1,
    limit: 30,
    total: 0,
    data: [] as EmptyArrayType,
  });

  const page = computed(() => route.params.id);
  const { data: actors } = await useAsyncData<any>(
    `actors-${page.value}`,
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
          <NuxtLink
            custom
            v-slot="{ navigate, href }"
            :to="`/actor/${item.id}`"
            class="text-decoration-none"
          >
            <v-sheet
              v-bind="props"
              flat
              :href="href"
              @click="navigate"
              class="pa-5 cursor-pointer rounded"
              :class="isHovering ? 'hover-shadow' : 'bg-none'"
              color="surface"
              min-height="230"
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
                    <h3 class="text-subtitle-1 font-weight-medium mb-1">
                      {{ item.name }}
                    </h3>
                    <div class="text-body-2 text-grey-darken-1 mb-2 truncate-3">
                      {{ item.intro }}
                    </div>
                  </div>
                  <div class="text-caption d-flex text-grey mb-1 d-flex ga-2">
                    <div v-for="(actor, index) in item?.actors">
                      <NuxtLink
                        @click.stop
                        :to="`/actor/detail/${actor.id}`"
                        class="text-decoration-none text-grey"
                      >
                        <v-chip
                          v-if="actor.name"
                          size="x-small"
                          class="text-capitalize"
                          :key="index"
                          variant="text"
                        >
                          {{ actor.name }}
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
                      v-for="(post, index) in item?.posts"
                      :key="post.id"
                    >
                      <NuxtLink
                        v-if="index < 4"
                        :to="`/article/${post.id}`"
                        class="text-decoration-none text-grey"
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
    <DesktopPaginate
      :page="state.page"
      :total="state.total"
      :limit="state.limit"
      base-path="/actor/page/"
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
