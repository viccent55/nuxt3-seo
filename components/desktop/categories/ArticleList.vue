<template>
  <v-card
    v-for="i in 2"
    :key="i"
    class="d-flex mb-4 position-relative"
    tag="article"
    style="min-height: 100px"
  >
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <div
        v-bind="hoverProps"
        class="image-container"
      >
        <v-img
          src="https://www.imperialbricks.co.uk/wp-content/uploads/2023/03/Imperial-Bricks-Linear-brick-measurements-300-x-100-x-40mm-1-1024x302.jpg"
          class="article-image"
          :class="{ 'image-hover': isHovering }"
          :cover="!isHovering"
        />
      </div>
    </v-hover>

    <v-card-text class="text-content">
      <h3>文章分类</h3>
      <div class="text-subtitle-2 font-weight-medium mt-1">
        某体育赛事爆冷门，冠军军首轮出局
      </div>
      <div class="text-caption mt-1 text-grey">
        这是描述文字的一部分，介绍文章内容...
        这是描述文字的一部分，介绍文章内容...
        这是描述文字的一部分，介绍文章内容...
      </div>
      <div class="d-flex align-center mt-2 text-grey text-caption">
        👁️ 12,341&nbsp;&nbsp;&nbsp;💬 324&nbsp;&nbsp;&nbsp;🕒 05-01 14:39
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .image-container {
    position: relative;
    width: 200px;
    /* height: 100px; */
    margin-right: 16px;
    overflow: visible;
    z-index: 1;
  }

  .article-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    transition: all 0.2s ease;
    object-fit: cover;
  }

  .image-hover {
    width: auto;
    min-width: 400px;
    max-width: 100%;
    z-index: 10;
    /* box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1); */
    /* transform: translateY(-10%); */
  }

  .text-content {
    position: relative;
    padding-left: 16px; /* Add padding to prevent text overlap */
  }

  /* Ensure the card can contain the expanded image */
  .position-relative {
    overflow: visible !important;
  }
</style>
