<script setup lang="ts">
  definePageMeta({
    keepalive: true,
  });

  import { getCategoryDetail } from "~/service/novel";

  const route = useRoute();
  const novelId = computed(() => route.params.id as string);
  const selectId = ref("");

  const { data: novel, pending } = await useAsyncData(
    `novel-detail-${novelId.value}`,
    () =>
      getCategoryDetail({
        pid: novelId.value,
        id: selectId.value || null,
      }),
    {
      watch: [selectId],
      transform: (data: EmptyObjectType) => {
        return data.data ?? [];
      },
      default: () => null,
    }
  );

  useSeo(
    computed(() => novel.value.chapter?.title),
    computed(() => novel.value.chapter?.seo_descriptions),
    computed(() => novel.value.chapter?.seo_keywords)
  );
  const activeBtn = (id: string) => {
    if (selectId.value === "") {
      selectId.value = novel.value.chapters[0]?.id;
    }
    if (selectId.value == id) return true;
    return false;
  };
</script>

<template>
  <v-container
    fluid
    class="pt-0"
  >
    <v-breadcrumbs
      :items="[
        { title: '小說', to: '/novel', disabled: false },
        {
          title: novel?.novie?.name,
          to: `/novel/${novel?.novie?.pid}`,
          disabled: !novel?.novie?.pid,
        },
        { title: novel?.chapter?.title, disabled: true },
      ]"
    />
    <v-card
      rounded="lg"
      flat
      class="pa-2"
    >
      <v-card-title>
        {{ novel?.chapter?.title }}
      </v-card-title>
      <v-card-text>
        <div v-text="novel?.chapter?.content" />
      </v-card-text>
    </v-card>
    <v-sheet
      rounded="lg"
      class="my-4 pa-5"
    >
      <v-row>
        <v-col
          v-for="(item, index) in novel?.chapters"
          :key="index"
          cols="12"
          md="4"
        >
          <v-btn
            block
            border
            @click="selectId = item.id"
            :color="activeBtn(item.id) ? 'primary' : ''"
            variant="text"
            class="justify-start text-surface-variant"
          >
            {{ item.title }}
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<style scoped lang="scss">
  .v-breadcrumbs :deep(a:visited) {
    // This will make sure that visited links in the breadcrumbs
    // do not change color and look the same as unvisited ones.
    // You can also set a specific color if you prefer.
    color: inherit;
  }
</style>
