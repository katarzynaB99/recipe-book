import { Recipe } from "~/server/utils/db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "id");
  console.info(`DELETE /api/v1/recipes/${recipeId}`);

  // Extract the token from the Authorization header
  const authHeader = event.req.headers['authorization'];
  if (!authHeader) {
    console.error('No header');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('No token');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Verify the token
  let decodedToken;
  try {
    const config = useRuntimeConfig(event);
    decodedToken = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    console.error(err);
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  try {
    // Find the existing recipe
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      console.error('No recipe with specified ID');
      throw createError({ statusCode: 404, statusMessage: 'Recipe not found' });
    }

    // Delete the recipe
    await recipe.destroy();

    return {
      status: 'success',
      message: 'Recipe deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return {
      status: 'error',
      message: 'Failed to delete recipe',
    };
  }
});