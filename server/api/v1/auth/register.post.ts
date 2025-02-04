import { User } from "~/server/utils/db";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  console.log('POST /api/v1/auth/register');
  const body = await readBody(event);
  const { username, password } = body;

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create the new user
  const newUser = await User.create({
    username,
    password_hash: hashedPassword,
  });

  return {
    status: 'success',
    data: newUser,
  };
});