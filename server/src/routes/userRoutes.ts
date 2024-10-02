import 'dotenv/config'
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UsersModel';

const router = Router();

const secret = process.env?.JWT_SECRET

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return
    }

    const newUser = await User.create({ username, email, password, role });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return
    }

    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' });

    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({ username, email, password });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

export default router;
