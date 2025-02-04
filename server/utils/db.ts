import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from 'bcryptjs';

export const sequelize = new Sequelize(process.env.NUXT_POSTGRES_URL!, {
  logging: false,
});

export class User extends Model {}
User.init({
  username: DataTypes.STRING,
  password_hash: DataTypes.STRING,
}, { sequelize, modelName: 'user' });

export class Recipe extends Model {}
Recipe.init({
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  instructions: DataTypes.TEXT,
  prep_time: DataTypes.INTEGER,
  cook_time: DataTypes.INTEGER,
}, { sequelize, modelName: 'recipe' });

export class Category extends Model {}
Category.init({
  name: DataTypes.STRING,
}, { sequelize, modelName: 'category' });

export class RecipeCategory extends Model {}
RecipeCategory.init(
  {},
  {
    sequelize,
    modelName: "recipeCategory",
  }
);

export class Favourite extends Model {}
Favourite.init({}, { sequelize, modelName: "favourite" });

// Define associations
User.hasMany(Recipe, { foreignKey: 'userId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'author' });

Recipe.belongsToMany(Category, { through: RecipeCategory });
Category.belongsToMany(Recipe, { through: RecipeCategory });

User.belongsToMany(Recipe, { through: Favourite, as: 'favouriteRecipes' });
Recipe.belongsToMany(User, { through: Favourite, as: 'favouritedBy' });

(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    username: 'admin',
    password_hash: bcrypt.hashSync('admin', 10),
  });

  const category = await Category.create({ name: 'Dinner' });

  const recipe = await Recipe.create({
    title: 'Spaghetti',
    description: 'A classic Italian dish',
    instructions: 'Boil water, add spaghetti, cook until al dente',
    prep_time: 5,
    cook_time: 10,
    userId: user.id, // Associate the recipe with the user
  });

  await RecipeCategory.create({
    recipeId: recipe.id,
    categoryId: category.id,
  });

  // Explicitly create a Favourite
  await Favourite.create({
    userId: user.id,
    recipeId: recipe.id,
  });
})();
