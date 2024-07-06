/** @format */

import WebSocket from 'ws';
import { Server } from 'http';
import type { INotification } from '../models/notification.models';
import { consumeFromQueue } from '../config/message.queue';
import logger from '../config/logger';

let wss: WebSocket.Server;

export const initializeWebSocketServer = (server: Server): void => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket) => {
    logger.info('WebSocket client connected');

    ws.on('message', (message: string) => {
      logger.info(`Received message: ${message}`);
      // Handle incoming messages from the client if needed
    });

    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
    });
  });

  // Start consuming notifications from the message queue
  consumeNotificationsFromQueue();
};

const consumeNotificationsFromQueue = async (): Promise<void> => {
  await consumeFromQueue('notifications', (message: string) => {
    const notification: INotification = JSON.parse(message);
    broadcastNotification(notification);
  });
};

const broadcastNotification = (notification: INotification): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
};
