<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });

  import { getCategories, getCategoryList } from "~/service/novel";
  const route = useRoute();
  const categoryId = computed(() => route.params.id);

  const { data: categories } = await useAsyncData(
    "novel-categories",
    () => getCategories({}),
    {
      transform: (data: EmptyObjectType) => data?.data || [],
      default: () => [],
    }
  );

  const { data: novelList, pending: listPending } = await useAsyncData(
    `novel-list-${categoryId.value}`,
    () => getCategoryList({ cid: categoryId.value }),
    {
      watch: [categoryId],
      transform: (data: EmptyObjectType) => data?.data || [],
      default: () => [],
    }
  );

  //seo category
  const item = computed(() =>
    categories.value.find(
      (item: EmptyObjectType) => item.id === route.params.id
    )
  );
  useSeo(
    computed(() => item.value.seo_title || item.value.name),
    computed(() => item.value?.seo_descriptions),
    computed(() => item.value?.seo_keywords)
  );
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <novel-category-channel-bar
          :items="categories"
          :active-index="route.params.id as string"
        />
      </v-col>
      <v-col cols="12">
        <novel-content-page
          :data="novelList?.items"
          :loading="listPending"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
