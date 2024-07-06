/** @format */

import { Document, Schema, model } from 'mongoose';

export interface INotification extends Document {
  id: string;
  userId: string;
  message: string;
  read: boolean;
}

const notificationSchema = new Schema<INotification>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
});

export const Notification = model<INotification>(
  'Notification',
  notificationSchema
);
