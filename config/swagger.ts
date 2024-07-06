/** @format */

import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservices Notification System API',
      version: '1.0.0',
      description: 'API documentation for the Notification System',
    },
    servers: [
      {
        url: 'https://microservices-notification-backend.onrender.com',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
