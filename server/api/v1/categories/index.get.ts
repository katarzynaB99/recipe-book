import { Recipe, Category, User } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  console.log("GET categories");
  const categories = await Category.findAll();
  console.log(`returning ${categories.length} categories`);
  return categories;
});