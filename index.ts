/** @format */

import express from 'express';
import type { Response, Express, Request, NextFunction } from 'express';

const app: Express = express();

// Middleware
app.use(express.json());

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Routes
// TODO: Add routes for Auth Service, Notification Service, and Real-Time Service

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
