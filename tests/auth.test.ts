/** @format */

import {
  describe,
  expect,
  it,
  beforeAll,
  afterEach,
  afterAll,
} from '@jest/globals';
import request from 'supertest';
import app from '../index.js';
import connectDB from '../config/database.js';
import { User } from '../models/user.models.js';
import mongoose from 'mongoose';

describe('Auth API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user and return a token', async () => {
      // Create a test user
      await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });
});
