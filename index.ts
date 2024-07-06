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

dotenv.config();
const app: Express = express();
const server = createServer(app);
app.use(express.json());

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

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
