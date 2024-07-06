/** @format */

import express from 'express';
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
} from '../services/notification.service';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    await createNotification(userId, message);
    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const notifications = await getNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await getNotificationById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    await markNotificationAsRead(notificationId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
