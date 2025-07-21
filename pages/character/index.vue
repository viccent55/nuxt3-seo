<script lang="ts" setup>
  const { data, pending, error } = await useAsyncData<ApiResponse>(
    "characters",
    async () => {
      const res = await $fetch<EmptyObjectType>(
        "/api/charactor/subject-latest",
        {
          method: "POST",
          body: {
            with_actor: 1,
            with_post: 1,
            page: 1,
            limit: 30,
          },
        }
      );
      return {
        items: res.data?.items || [],
        count: res.data?.count || 0,
      };
    }
  );
</script>
<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-6">人物</h2>
    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in data?.items"
        :key="index"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="pa-4"
            flat
            tag="article"
            :elevation="isHovering ? 8 : 0"
            to="/"
            min-height="210"
          >
            <v-row no-gutters>
              <v-col
                cols="auto"
                class="pr-4"
              >
                <v-avatar
                  size="160"
                  class="rounded"
                >
                  <Image
                    :src="item.cover"
                    cover
                  >
                  <v-chip color="primary">asdf</v-chip>
                  </Image>
                </v-avatar>
              </v-col>

              <v-col>
                <h3 class="text-subtitle-1 font-weight-medium mb-1">
                  {{ item.name }}
                </h3>

                <div class="text-body-2 text-grey-darken-1 mb-2">
                  {{ item.intro }}
                </div>
                <div class="text-caption text-grey mb-1 d-flex ga-2">
                  <strong>相关文章：</strong>
                  <div v-for="(iten, index) in item.actors">
                    <v-chip
                      v-if="iten.name"
                      size="x-small"
                      class="text-capitalize"
                      :key="index"
                    >
                      {{ iten.name }}
                    </v-chip>
                  </div>
                </div>
                <v-divider class="my-2" />
                <v-row dense>
                  <v-col
                    cols="6"
                    v-for="post in item.posts"
                    :key="post.id"
                  >
                    <div class="d-flex align-center">
                      <v-icon
                        icon="mdi-circle-small"
                        size="small"
                        class="mr-1"
                      />
                      <div class="truncate-1 text-caption text-grey">
                        {{ post.title }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
