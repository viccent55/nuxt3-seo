import { ref } from "vue";

export default function useMenuCategories() {
  const menuCategories = ref([
    {
      name: "文章分类",
      value: "category-1",
      path: "/home/categories/article-1",
    },
    {
      name: "文章分类",
      value: "category-2",
      path: "/home/categories/article-2",
    },
    {
      name: "文章分类",
      value: "category-3",
      path: "/home/categories/article-3",
    },
    {
      name: "文章分类",
      value: "category-4",
      path: "/home/categories/article-4",
    },
    {
      name: "文章分类",
      value: "category-5",
      path: "/home/categories/article-5",
    },
  ]);

  return {
    menuCategories,
  };
}
