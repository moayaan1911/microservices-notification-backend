/** @format */
import express from 'express';
import type { Response, Express, Request, NextFunction } from 'express';
import { connectToMessageQueue } from './config/message.queue';
import { initializeWebSocketServer } from './services/realtime.service';
import { createServer } from 'http';
import logger from './config/logger';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import notificationRoutes from './routes/notification.routes';
import bodyParser from 'body-parser';
dotenv.config();
const app: Express = express();
const server = createServer(app);
app.use(express.json());

// Default route
app.get('/', (req: Request, res: Response) => {
  const apiDocs = {
    'API Documentation': 'Welcome to the Notification System API',
    Endpoints: [
      {
        name: 'Register User',
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user',
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        },
        response: {
          status: 201,
          body: {
            message: 'User registered successfully',
          },
        },
      },
      {
        name: 'Login User',
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login a user',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
        response: {
          status: 200,
          body: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      {
        name: 'Get All Users',
        method: 'GET',
        path: '/api/auth/users',
        description: 'Get all users (requires authentication)',
        headers: {
          Authorization: 'Bearer <JWT_TOKEN>',
        },
        response: {
          status: 200,
          body: [
            {
              id: 'user1',
              username: 'testuser1',
              email: 'test1@example.com',
            },
            {
              id: 'user2',
              username: 'testuser2',
              email: 'test2@example.com',
            },
          ],
        },
      },
      {
        name: 'Create Notification',
        method: 'POST',
        path: '/api/notifications',
        description: 'Create a new notification',
        headers: {
          Authorization: 'Bearer <JWT_TOKEN>',
        },
        body: {
          userId: 'user1',
          message: 'This is a test notification',
        },
        response: {
          status: 201,
          body: {
            message: 'Notification created successfully',
          },
        },
      },
      {
        name: 'Get All Notifications',
        method: 'GET',
        path: '/api/notifications/all',
        description: 'Get all notifications',
        headers: {
          Authorization: 'Bearer <JWT_TOKEN>',
        },
        response: {
          status: 200,
          body: [
            {
              id: 'notif1',
              userId: 'user1',
              message: 'Test notification 1',
              read: false,
              createdAt: '2023-07-07T12:00:00.000Z',
            },
            {
              id: 'notif2',
              userId: 'user2',
              message: 'Test notification 2',
              read: true,
              createdAt: '2023-07-07T13:00:00.000Z',
            },
          ],
        },
      },
      {
        name: "Get User's Notifications",
        method: 'GET',
        path: '/api/notifications?userId=user1',
        description: 'Get notifications for a specific user',
        headers: {
          Authorization: 'Bearer <JWT_TOKEN>',
        },
        response: {
          status: 200,
          body: [
            {
              id: 'notif1',
              userId: 'user1',
              message: 'Test notification 1',
              read: false,
              createdAt: '2023-07-07T12:00:00.000Z',
            },
          ],
        },
      },
      {
        name: 'Get Specific Notification',
        method: 'GET',
        path: '/api/notifications/:id',
        description: 'Get a specific notification by ID',
        headers: {
          Authorization: 'Bearer <JWT_TOKEN>',
        },
        response: {
          status: 200,
          body: {
            id: 'notif1',
            userId: 'user1',
            message: 'Test notification 1',
            read: false,
            createdAt: '2023-07-07T12:00:00.000Z',
          },
        },
      },
      {
        name: 'Mark Notification as Read',
        method: 'PUT',
        path: '/api/notifications/:id',
        description: 'Mark a specific notification as read',
        headers: {
          Authorization: 'Bearer <JWT_TOKEN>',
        },
        response: {
          status: 200,
          body: {
            message: 'Notification marked as read',
          },
        },
      },
    ],
  };

  res.json(apiDocs);
});

app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);
  await connectDB();
  await connectToMessageQueue();
  initializeWebSocketServer(server);
});

export default app;
