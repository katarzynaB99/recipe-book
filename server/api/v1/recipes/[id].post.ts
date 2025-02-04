import { Recipe, Category } from "~/server/utils/db";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "id");
  console.info(`POST /api/v1/recipes/${recipeId}`);

  // Extract the token from the Authorization header
  const authHeader = event.req.headers['authorization'];
  if (!authHeader) {
    console.error('no header')
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('no token')
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Verify the token
  let decodedToken;
  try {
    const config = useRuntimeConfig(event);
    decodedToken = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    console.error(err)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);

  try {
    // Find the existing recipe
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      console.error('no recipe with specified ID');
      throw createError({ statusCode: 404, statusMessage: 'Recipe not found' });
    }

    // Update the recipe fields
    recipe.title = body.title;
    recipe.description = body.description;
    recipe.instructions = body.instructions;
    recipe.prep_time = body.prep_time;
    recipe.cook_time = body.cook_time;
    await recipe.save();

    // Associate the recipe with the selected categories
    if (body.categories && body.categories.length > 0) {
      const categories = await Category.findAll({
        where: {
          id: body.categories,
        },
      });
      await recipe.setCategories(categories);
    }

    return {
      status: 'success',
      data: recipe,
    };
  } catch (error) {
    console.error('Error updating recipe:', error);
    return {
      status: 'error',
      message: 'Failed to update recipe',
    };
  }
});