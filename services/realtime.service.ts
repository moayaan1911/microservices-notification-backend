/** @format */

import WebSocket from 'ws';
import { Server } from 'http';
import { Notification } from '../models/notification.models';
import { consumeFromQueue } from '../config/message.queue';
import logger from '../config/logger';
import type { INotification } from '../models/notification.models';
let wss: WebSocket.Server;

export const initializeWebSocketServer = (server: Server): void => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    logger.info('WebSocket client connected');

    ws.on('message', (message: string) => {
      logger.info(`Received message: ${message}`);
    });

    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
    });
  });

  // Start consuming notifications from the message queue
  consumeNotificationsFromQueue();
};

const consumeNotificationsFromQueue = async (): Promise<void> => {
  await consumeFromQueue('notifications', async (message: string) => {
    try {
      const notificationData: INotification = JSON.parse(message);

      // Create a new notification document
      const notification = new Notification(notificationData);

      // Save the notification to the database
      await notification.save();

      logger.info(`Notification saved to database: ${notification._id}`);

      // Broadcast the notification
      broadcastNotification(notification);
    } catch (error) {
      logger.error('Error processing notification:', error);
    }
  });
};

const broadcastNotification = (notification: INotification): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
};
