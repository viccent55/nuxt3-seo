// pages/[...404].vue
<template>
  <div v-if="$route.path.startsWith('/.well-known')">
    <!-- Just silently ignore Chrome's request -->
  </div>
  <div v-else>
    <h1>Page Not Found</h1>
  </div>
</template>
