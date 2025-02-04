import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "id");
  console.info(`GET /api/v1/recipes/${recipeId}`);

  const authHeader = event.req.headers['authorization'];
  if (!authHeader) {
    console.error('no header');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token missing');
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
  const userId = decodedToken.id;
  const recipeObj = await Recipe.findByPk(recipeId, {
    include: [
      {
        model: Category,
        attributes: ["id", "name"],
        through: { attributes: [] }, // Exclude RecipeCategory attributes
      },
      {
        model: User,
        as: "author",
        attributes: ["username"],
      },
      {
        model: Favourite,
        attributes: ["userId"],
        required: false,
        where: { userId },
      },
    ],
  });
  if (!recipeObj) return {};
  console.info('returning recipe');
  return {
    id: recipeObj.id,
    title: recipeObj.title,
    description: recipeObj.description,
    instructions: recipeObj.instructions,
    prep_time: recipeObj.prep_time,
    cook_time: recipeObj.cook_time,
    categories: recipeObj.categories.map((categoryObj) => ({ name: categoryObj.name, id: categoryObj.id })),
    author: recipeObj.author ? recipeObj.author.username : '',
    isFavorite: recipeObj.favourites.length > 0
  };
});
