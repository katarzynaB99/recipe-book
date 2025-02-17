import { Favourite, Recipe } from "~/server/utils/db";
import jwt from "jsonwebtoken";
// import authMiddleware from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  console.info('POST /api/v1/favourites/toggle');
  // Extract the token from the Authorization header
  const authHeader = event.req.headers['authorization'];
  if (!authHeader) {
    console.error('no header');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('no token');
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
  const body = await readBody(event);
  const { recipeId } = body;
  const userId = decodedToken.id;

  const favorite = await Favourite.findOne({ where: { userId, recipeId } });

  if (favorite) {
    // If the recipe is already a favorite, remove it
    await favorite.destroy();
    console.info('Favourite removed');
    return { status: 'success', message: 'Removed from favorites' };
  } else {
    // If the recipe is not a favorite, add it
    await Favourite.create({ userId, recipeId });
    console.info('Favourite created');
    return { status: 'success', message: 'Added to favorites' };
  }
});