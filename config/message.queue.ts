/** @format */

import amqp from 'amqplib';
import logger from './logger';

let channel: amqp.Channel;

import dotenv from 'dotenv';
dotenv.config();
export const connectToMessageQueue = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    channel = await connection.createChannel();
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
};

export const publishToQueue = async (
  queueName: string,
  message: string
): Promise<void> => {
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
};
export const consumeFromQueue = async (
  queueName: string,
  onMessage: (message: string) => void
): Promise<void> => {
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (message) => {
    if (message) {
      onMessage(message.content.toString());
      channel.ack(message);
    }
  });
};
