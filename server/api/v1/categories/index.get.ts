import { Recipe, Category, User } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  console.info("GET categories");
  const categories = await Category.findAll();
  console.info(`returning ${categories.length} categories`);
  return categories;
});