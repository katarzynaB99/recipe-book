export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('Creating recipe', body);

  try {
    const newRecipe = await Recipe.create({
      title: body.title,
      description: body.description,
      instructions: body.instructions,
      prep_time: body.prep_time,
      cook_time: body.cook_time,
      // Assuming you have a userId to associate with the recipe
      // userId: body.userId, // Uncomment and set this if you have userId in the request body
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