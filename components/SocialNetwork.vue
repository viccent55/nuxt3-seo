<script lang="ts" setup>
  const { store } = useVariable();
</script>

<template>
  <DesktopSidebarSection
    title="最新地址"
    :more="false"
  >
    <v-card
      elevation="0"
      class="pl-md-4 pl-2 pt-4 pb-4"
    >
      <v-list
        class="pa-0"
        density="compact"
      >
        <v-list-item
          class="rounded-sm"
          bg-color="blue-lighten-5"
        >
          <v-list-item-title class="text-caption">
            最新地址：
            <a
              :href="store.configuration?.website_url"
              target="_blank"
              class="text-primary text-caption font-weight-medium text-pre-wrap"
            >
              {{ store.configuration?.website_url }}
            </a>
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          class="rounded-sm"
          bg-color="blue-lighten-5"
        >
          <v-list-item-title class="text-caption">
            备用地址：
            <a
              :href="store.configuration?.latest_url"
              target="_blank"
              class="text-primary text-caption font-weight-medium text-pre-wrap"
            >
              {{ store.configuration?.latest_url }}
            </a>
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          class="rounded-sm"
          color="primary"
        >
          <v-list-item-title class="text-caption">
            永久域名：
            <a
              :href="store.configuration?.backup_url"
              target="_blank"
              class="text-primary text-caption font-weight-medium text-pre-wrap"
            >
              {{ store.configuration?.backup_url }}
            </a>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="rounded-sm"
          color="primary"
        >
          <v-list-item-title class="text-caption">
            防失联邮箱：
            <a
              :href="'mailto:' + store.configuration?.email"
              target="_blank"
              class="text-primary text-caption font-weight-medium text-pre-wrap"
            >
              {{ store.configuration?.email }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-row
        justify="center"
        class="mt-2"
      >
        <v-sheet
          color="bg-none"
          class="pb-4 d-flex ga-5 bg-none"
        >
          <a
            :href="store.configuration?.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-surface-variant"
          >
            <v-icon>mdi-github</v-icon>
          </a>
          <a
            :href="store.configuration?.twitter"
            target="_blank"
            rel="noopener noreferrer"
            class="text-surface-variant"
          >
            <v-icon>mdi-twitter</v-icon>
          </a>
          <a
            :href="store.configuration?.gitlab"
            target="_blank"
            rel="noopener noreferrer"
            class="text-surface-variant"
          >
            <v-icon>mdi-gitlab</v-icon>
          </a>
        </v-sheet>
      </v-row>
    </v-card>
  </DesktopSidebarSection>
</template>
