<script lang="ts" setup>
  definePageMeta({
    middleware: ["redirect-home"],
  });

  const { homeConfig } = useMenuCategories();
  const state = reactive({
    subjects: [] as EmptyArrayType,
    filter: {
      field: "home",
      with_actor: 1,
      with_post: 1,
      page: 1,
      limit: 6,
    },
  });
  const {
    data: subject,
    error: subjectError,
    pending: subjectPending,
  } = await useApiFetch<EmptyObjectType>("/api/home/subject", {
    method: "POST",
    body: state.filter,
    transform: (res: EmptyObjectType) => {
      return {
        items: res.data.items || [],
        count: res.data.count || 0,
      };
    },
  });

  watchEffect(() => {
    if (subject.value) {
      state.subjects = subject.value.items ?? [];
    }
  });
</script>

<template>
  <v-container class="px-0 mt-4">
    <!-- <div v-if="pending">Loading...</div> -->
    <!-- Scrollable Category Bar -->
    <v-toolbar
      class="category-scroll-wrapper px-4 mb-4"
      color="surface"
    >
      <v-slide-group
        show-arrows
        class="category-slide-group"
      >
        <v-slide-group-item
          v-for="(category, index) in homeConfig.categories"
          :key="index"
        >
          <v-btn
            :to="category.name"
            variant="text"
            class="text-button"
            height="36"
            density="compact"
          >
            {{ category.name }}
          </v-btn>
          <v-divider
            v-if="index < homeConfig.categories.length - 1"
            vertical
            class="mx-1 mt-2"
            length="18"
          />
        </v-slide-group-item>
      </v-slide-group>
    </v-toolbar>

    <!-- Page Content -->
    <NuxtPage :subjects="state.subjects" />
    <!-- Show child page content -->
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
  .category-scroll-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .category-slide-group {
    max-width: 100%;
  }

  .text-button {
    white-space: nowrap;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    transition: color 0.2s ease;
  }

  .text-button:hover {
    color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.08);
  }

  .router-link-exact-active {
    color: rgb(var(--v-theme-primary));
    font-weight: 700;
  }
</style>
