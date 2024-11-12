import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/UsersModel';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // secure: true, Только когда https
      sameSite: 'none', 
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, Только когда https
      sameSite: 'none', 
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const hashedPassword = user.getDataValue('password');
    const isPasswordValid = bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // secure: true, Только когда https
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, Только когда https
      sameSite: 'none', 
    });

    res.json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.post(
  '/refresh-token',
  async (req: Request, res: Response): Promise<void> => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { userId: number };

      const newAccessToken = generateAccessToken({ id: decoded.userId });
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        // secure: true, Только когда https
        sameSite: 'none',
      });

      res.json({ accessToken: newAccessToken });
    } catch (error: any) {
      console.error('Error verifying refresh token:', error);
      res
        .status(403)
        .json({ message: 'Invalid refresh token', error: error.message });
    }
  }
);

router.delete('/delete-user/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

router.put('/update-user/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const user = await User.findByPk(userId);

    if (user) {
      await user.update(updates);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.get('/get-users', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error can not upload users' });
  }
});

export default router;

