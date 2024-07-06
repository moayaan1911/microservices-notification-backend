/** @format */

import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  connected: boolean;
}

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  connected: { type: Boolean, default: false },
});

export const User = model<IUser>('User', userSchema);
