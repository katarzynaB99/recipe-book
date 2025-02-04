export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, 'id');
  console.log(`GET /api/v1/recipes/${recipeId}`);

  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      { model: User, as: 'author', attributes: ['username'] },
      { model: Category, as: 'categories' },
    ],
  });
  return recipe;
})
