import { connectToDatabase, getCollection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const SALT_ROUNDS = 10;

export async function findUserEmail(email: string) {
  const users = getCollection("users");
  const user = await users.findOne({ email });
  return user;
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
) {
  const users = getCollection("users");
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await users.insertOne({ fullName, email, password: hashedPassword });
}

export async function registerController(
  fullName: string,
  email: string,
  password: string,
) {
  await connectToDatabase();
  const user = await findUserEmail(email);

  if (user) {
    throw Error("If the email is exist we will share you update on email!");
  }

  await registerUser(fullName, email, password);
}

export async function loginController(email: string, password: string) {
  await connectToDatabase();
  const user = await findUserEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Error("User or password does not match!");
  }
  return { id: user._id.toString(), email: user.email, fullName: user.fullName };
}

export async function getUserById(userId: string) {
  await connectToDatabase();
  const users = getCollection("users");
  const user = await users.findOne({ _id: new ObjectId(userId) });
  return user;
}
