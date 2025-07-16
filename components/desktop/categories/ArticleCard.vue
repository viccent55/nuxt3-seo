<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      tag="article"
      v-bind="props"
      :elevation="isHovering ? 8 : 0"
      class="transition-fast-in-fast-out"
    >
      <v-img
        src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
        height="160"
        lazy-src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ519BsNFaVDx_YmDcTJ7T2qOnXbXKJFL9RmmxzjamEeVWNRGwB"
        cover
      />
      <v-card-text class="text-subtitle-2">
        Temu美区全托管将在7月底全面恢复运营
      </v-card-text>
    </v-card>
  </v-hover>
</template>
