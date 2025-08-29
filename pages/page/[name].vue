<script lang="ts" setup>
  const route = useRoute();
  const pageNamge = computed(() => route.params.name);
  const { data: page } = await useAsyncData<EmptyObjectType>(
    () => `page-${pageNamge.value}`,
    () =>
      $fetch("/api/page", {
        method: "POST",
        body: {
          page: pageNamge.value,
        },
      }),
    {
      watch: [() => pageNamge.value],
    }
  );
  useSeo(
    computed(() => page.value?.data.seo_title),
    computed(() => page.value?.data.seo_description),
    computed(() => page.value?.data.seo_keywords)
  );
</script>

<template>
  <v-container min-height="80vh">
    <v-row
      justify="center"
      class="my-md-10 my-5"
    >
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <v-card
          flat
          color="transparent"
        >
          <v-card-title
            class="text-h4 font-weight-bold text-center"
            tag="h1"
          >
            {{ page?.data?.name }}
          </v-card-title>
          <v-card-subtitle class="text-center text-medium-emphasis mb-10">
            {{ page?.data.title }}
          </v-card-subtitle>

          <v-row>
            <!-- Contact Info -->
            <v-col
              cols="12"
              v-html="page?.data.content"
            ></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
