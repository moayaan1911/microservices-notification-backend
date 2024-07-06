/** @format */

import { User } from '../models/user.models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<void> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    id: generateUUID(),
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
};

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
  return token;
};

const generateUUID = (): string => {
  // Generate and return a unique identifier (you can use a library like 'uuid' for this)
  // For simplicity, we'll use a timestamp-based UUID here
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
