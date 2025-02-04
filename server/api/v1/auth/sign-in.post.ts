import { User } from "~/server/utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  console.log('POST /api/v1/auth/sign-in')
  const body = await readBody(event);
  const { username, password } = body;

  const user = await User.findOne({ where: { username } });
  // console.log(user);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    console.error('Invalid credentials');
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
  }
  console.log('generating token');
  console.log(process.env.NUXT_JWT_SECRET)

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.NUXT_JWT_SECRET!, { expiresIn: "1h" });

  console.log('returning token');
  return { token };
});