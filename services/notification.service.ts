/** @format */

import { v4 as uuidv4 } from 'uuid';
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
    id: uuidv4(),
    userId: user.id,
    message,
    read: false,
  };

  const notification = new Notification(notificationData);
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

  const notifications = await Notification.find({ userId: user.id });
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

export const getAllNotifications = async (): Promise<INotification[]> => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  return notifications;
};
