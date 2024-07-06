/** @format */

import { Types } from 'mongoose';
import { Notification } from '../models/notification.models';
import { User } from '../models/user.models';
import { publishToQueue } from '../config/message.queue';
import type { INotification } from '../models/notification.models';
interface NotificationData {
  id: string;
  userId: string;
  message: string;
  read: boolean;
}

export const createNotification = async (
  userId: string,
  message: string
): Promise<void> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const notificationData: NotificationData = {
    id: generateUUID(),
    userId: user.id,
    message,
    read: false,
  };

  const notification = new Notification({
    ...notificationData,
    userId: new Types.ObjectId(notificationData.userId),
  });
  await notification.save();

  // Publish the notification to the message queue
  await publishToQueue('notifications', JSON.stringify(notificationData));
};

export const getNotifications = async (
  userId: string
): Promise<INotification[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new Error('User not found');
  }

  const notifications = await Notification.find({ userId: user._id });
  return notifications;
};

export const getNotificationById = async (
  id: string
): Promise<INotification | null> => {
  const notification = await Notification.findOne({ id });
  return notification;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await Notification.updateOne({ id }, { read: true });
};

const generateUUID = (): string => {
  // Generate and return a unique identifier (you can use a library like 'uuid' for this)
  // For simplicity, we'll use a timestamp-based UUID here
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
