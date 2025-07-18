<script lang="ts" setup>
  import useMenuCategories from "../composables/useMenuCategories";

  definePageMeta({
    middleware: ["redirect-home"],
  });

  const { menuCategories } = useMenuCategories();
  const state = reactive({
    subject: [] as EmptyArrayType,
    filter: {
      field: "home",
      with_actor: 1,
      with_post: 1,
      page: 1,
      limit: 6,
    },
    latest: [] as EmptyArrayType,
  });
  const {
    data: subject,
    error: subjectError,
    pending: subjectPending,
  } = await useApiFetch<EmptyObjectType>("/api/home/subject", {
    method: "POST",
    body: state.filter,
  });

  watchEffect(() => {
    if (subject.value) {
      state.subject = subject.value.data;
    }
  });
</script>

<template>
  <v-container class="px-0 mt-4">
    <!-- <div v-if="pending">Loading...</div> -->
    <!-- Shared Categories Menu -->
    <v-toolbar
      class="d-flex px-8 rounded-lg"
      density="compact"
      color="surface"
    >
      <template
        v-for="(category, index) in menuCategories"
        :key="category.path"
      >
        <NuxtLink
          :to="category.path"
          class="text-button"
        >
          {{ category.name }}
        </NuxtLink>
        <v-divider
          v-if="index < menuCategories.length - 1"
          vertical
          class="mx-4"
          length="18"
        />
      </template>
    </v-toolbar>
    <!-- Show child page content -->

    <NuxtPage
      :subject="state.subject"
      :latest="state.latest"
    />
    <v-row dense>
      <v-col cols="6">
        <v-sheet
          class="pa-8 text-center my-4"
          color="blue-lighten-5"
        >
          广告位
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <v-sheet
          class="pa-8 text-center my-4"
          color="blue-lighten-5"
        >
          广告位
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  .v-toolbar :deep(.v-divider) {
    align-self: center;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .text-button {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
  .router-link-exact-active {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
  }
</style>
