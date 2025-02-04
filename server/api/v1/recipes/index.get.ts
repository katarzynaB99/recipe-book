import { Recipe, Category, User } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  console.log("GET recipes");
  const recipes = await Recipe.findAll({
    include: [
      {
        model: Category,
        attributes: ['name'],
        through: { attributes: [] } // Exclude RecipeCategory attributes
      },
      {
        model: User,
        as: 'author',
        attributes: ['username']
      }
    ],
  });
  console.log(`returning ${recipes.length} recipes`);
  return recipes.map((recipeObj) => ({
    id: recipeObj.id,
    title: recipeObj.title,
    description: recipeObj.description,
    instructions: recipeObj.instructions,
    prep_time: recipeObj.prep_time,
    cook_time: recipeObj.cook_time,
    categories: recipeObj.categories.map((categoryObj) => categoryObj.name),
    author: recipeObj.author ? recipeObj.author.username : '',
  }));
});