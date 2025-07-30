<script lang="ts" setup>
  const { isMobile } = useVariable();
  const state = reactive({
    page: 1,
    limit: 10,
    total: 0,
    data: [] as EmptyArrayType,
    inputPageNumber: 1,
  });

  const fetchData = async () => {
    const res = await $fetch<EmptyObjectType>("/api/actor/latest", {
      method: "POST",
      body: {
        with_actor: 1,
        with_post: 1,
        page: state.page,
        limit: state.limit,
      },
    });

    state.data = res.data?.items || [];
    state.total = res.data?.count || 0;
  };

  await fetchData();
  watch(
    () => state.page,
    (v) => {
      state.inputPageNumber = v;
      fetchData();
    }
  );

  const clampPage = (page: number) => {
    const maxPage = Math.ceil(state.total / state.limit) || 1;
    return Math.min(Math.max(1, page || 1), maxPage);
  };

  const onInputPageBlur = () => {
    state.inputPageNumber = clampPage(state.inputPageNumber);
  };
</script>
<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-6">人物</h2>
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in state.data"
        :key="index"
      >
        <v-hover v-slot="{ isHovering, props }">
          <NuxtLink
            :to="`/actor/detail/${item.id}`"
            class="text-decoration-none"
          >
            <v-sheet
              v-bind="props"
              flat
              class="pa-5 cursor-pointer rounded"
              :class="isHovering ? 'hover-shadow' : 'bg-none'"
              tag="article"
              color="surface"
              min-height="220"
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
                          variant="text"
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
    <DesktopPaginate
      :page="state.page"
      :total="state.total"
      :limit="state.limit"
      :isMobile="isMobile"
      @update:page="state.page = $event"
    />
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
