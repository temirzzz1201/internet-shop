import 'dotenv/config';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/UsersModel';

const router = Router();
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!secret || !refreshSecret) {
  throw new Error('JWT_SECRET or JWT_REFRESH_SECRET environment variables are not set');
}

const accessTokenExpiresIn = '1h';
const refreshTokenExpiresIn = '7d';

const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, secret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: refreshTokenExpiresIn });
  return { accessToken, refreshToken };
};

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();

    res.status(201).json({
      users,
      message: 'Users found',
    });
    return;
  }
  catch (error: any) {
    res.status(500).json({ message: 'Can not find users', error: error.message });
  }

})

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

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await User.create({ username, email, password: hashedPassword, role });

    const { accessToken, refreshToken } = generateTokens(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
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
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      user
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.post('/refresh-token', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, refreshSecret) as { userId: number };
    const newAccessToken = jwt.sign({ userId: decoded.userId }, secret, { expiresIn: accessTokenExpiresIn });


    res.json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(403).json({ message: 'Invalid refresh token', error: error.message });
  }
});

router.delete('/delete-user/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: 'Продукт удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении продукта' });
  }
});


router.put('/update-user/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const users = await User.findByPk(userId);

    if (users) {
      await users.update(updates);
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'Продукт не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении продукта' });
  }
});

export default router;
