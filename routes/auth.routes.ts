/** @format */

import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../services/auth.service';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: (error as any).message });
  }
});
router.get('/users', async (req, res) => {
  try {
    console.log('Fetching users...');
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
});
export default router;
