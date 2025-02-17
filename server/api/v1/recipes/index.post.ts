// import authMiddleware from "~/server/middleware/auth";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  console.info('POST /api/v1/recipes');

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
    const newRecipe = await Recipe.create({
      title: body.title,
      description: body.description,
      instructions: body.instructions,
      prep_time: body.prep_time,
      cook_time: body.cook_time,
      userId: body.user_id
    });

    // Associate the recipe with the selected categories
    if (body.categories && body.categories.length > 0) {
      const categories = await Category.findAll({
        where: {
          id: body.categories,
        },
      });
      await newRecipe.setCategories(categories);
    }

    return {
      status: 'success',
      data: newRecipe,
    };
  } catch (error) {
    console.error('Error creating recipe:', error);
    return {
      status: 'error',
      message: 'Failed to create recipe',
    };
  }
});