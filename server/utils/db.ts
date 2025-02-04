import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from 'bcryptjs';
import pg from 'pg';

export const sequelize = new Sequelize(process.env.NUXT_POSTGRES_URL!, {
  logging: false,
  dialect: 'postgres',
  dialectModule: pg
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
User.hasMany(Favourite, { foreignKey: 'userId' });
Recipe.hasMany(Favourite, { foreignKey: 'recipeId' });

// DB Seeding
(async () => {
  await sequelize.sync({ force: true });

  // Create users
  const users = await Promise.all([
    User.create({ username: 'admin', password_hash: bcrypt.hashSync('admin', 10) }),
    User.create({ username: 'user1', password_hash: bcrypt.hashSync('password1', 10) }),
    User.create({ username: 'user2', password_hash: bcrypt.hashSync('password2', 10) }),
    User.create({ username: 'user3', password_hash: bcrypt.hashSync('password3', 10) }),
    User.create({ username: 'user4', password_hash: bcrypt.hashSync('password4', 10) }),
  ]);
  // Create categories
  const categories = await Promise.all([
    Category.create({ name: 'Dinner' }),
    Category.create({ name: 'Lunch' }),
    Category.create({ name: 'Breakfast' }),
    Category.create({ name: 'Dessert' }),
    Category.create({ name: 'Snack' }),
  ]);
  // Create recipes
  const recipes = await Promise.all([
    Recipe.create({ title: 'Spaghetti', description: 'A classic Italian dish', instructions: 'Boil water, add spaghetti, cook until al dente', prep_time: 5, cook_time: 10, userId: users[0].id }),
    Recipe.create({ title: 'Pizza', description: 'A classic Italian dish', instructions: 'Roll out dough, add toppings, bake', prep_time: 10, cook_time: 20, userId: users[1].id }),
    Recipe.create({ title: 'Pancakes', description: 'Fluffy pancakes', instructions: 'Mix ingredients, cook on griddle', prep_time: 5, cook_time: 10, userId: users[2].id }),
    Recipe.create({ title: 'Salad', description: 'Fresh salad', instructions: 'Chop vegetables, mix', prep_time: 10, cook_time: 0, userId: users[3].id }),
    Recipe.create({ title: 'Soup', description: 'Warm soup', instructions: 'Boil ingredients, simmer', prep_time: 10, cook_time: 30, userId: users[4].id }),
    Recipe.create({ title: 'Burger', description: 'Juicy burger', instructions: 'Grill patty, assemble burger', prep_time: 10, cook_time: 15, userId: users[0].id }),
    Recipe.create({ title: 'Steak', description: 'Grilled steak', instructions: 'Season steak, grill', prep_time: 5, cook_time: 10, userId: users[1].id }),
    Recipe.create({ title: 'Tacos', description: 'Mexican tacos', instructions: 'Prepare fillings, assemble tacos', prep_time: 10, cook_time: 10, userId: users[2].id }),
    Recipe.create({ title: 'Sushi', description: 'Japanese sushi', instructions: 'Prepare rice, roll sushi', prep_time: 20, cook_time: 0, userId: users[3].id }),
    Recipe.create({ title: 'Curry', description: 'Spicy curry', instructions: 'Cook ingredients, simmer', prep_time: 10, cook_time: 20, userId: users[4].id }),
    Recipe.create({ title: 'Pasta', description: 'Italian pasta', instructions: 'Boil pasta, add sauce', prep_time: 5, cook_time: 10, userId: users[0].id }),
    Recipe.create({ title: 'Sandwich', description: 'Simple sandwich', instructions: 'Assemble ingredients', prep_time: 5, cook_time: 0, userId: users[1].id }),
    Recipe.create({ title: 'Omelette', description: 'Fluffy omelette', instructions: 'Beat eggs, cook in pan', prep_time: 5, cook_time: 5, userId: users[2].id }),
    Recipe.create({ title: 'Fries', description: 'Crispy fries', instructions: 'Cut potatoes, fry', prep_time: 10, cook_time: 10, userId: users[3].id }),
    Recipe.create({ title: 'Cake', description: 'Delicious cake', instructions: 'Mix ingredients, bake', prep_time: 15, cook_time: 30, userId: users[4].id }),
    Recipe.create({ title: 'Brownies', description: 'Chocolate brownies', instructions: 'Mix ingredients, bake', prep_time: 10, cook_time: 20, userId: users[0].id }),
    Recipe.create({ title: 'Ice Cream', description: 'Homemade ice cream', instructions: 'Mix ingredients, freeze', prep_time: 10, cook_time: 0, userId: users[1].id }),
    Recipe.create({ title: 'Smoothie', description: 'Healthy smoothie', instructions: 'Blend ingredients', prep_time: 5, cook_time: 0, userId: users[2].id }),
    Recipe.create({ title: 'Muffins', description: 'Blueberry muffins', instructions: 'Mix ingredients, bake', prep_time: 10, cook_time: 20, userId: users[3].id }),
    Recipe.create({ title: 'Cookies', description: 'Chocolate chip cookies', instructions: 'Mix ingredients, bake', prep_time: 10, cook_time: 15, userId: users[4].id }),
  ]);

  // Associate recipes with categories
  await Promise.all(recipes.map((recipe, index) => {
    const categoryIds = [categories[index % categories.length].id];
    if (index % 2 === 0) {
      categoryIds.push(categories[(index + 1) % categories.length].id);
    }
    return recipe.setCategories(categoryIds);
  }));
  // Explicitly create some Favourites
  await Favourite.create({ userId: users[0].id, recipeId: recipes[0].id });
  await Favourite.create({ userId: users[1].id, recipeId: recipes[1].id });
  await Favourite.create({ userId: users[2].id, recipeId: recipes[2].id });
  await Favourite.create({ userId: users[3].id, recipeId: recipes[3].id });
  await Favourite.create({ userId: users[4].id, recipeId: recipes[4].id });
})();
