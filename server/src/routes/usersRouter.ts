import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/UsersModel';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import crypto from 'crypto'
import jwt from 'jsonwebtoken';
import { sendResetPassword } from '../utils/nodemailer';
import { Op } from 'sequelize'; // Добавьте импорт Op
import dayjs from 'dayjs';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Все поля обезательны!' });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Пользователь уже зарегестрирован' });
      return;
    }

    const newUser = await User.create({
      username,
      email,
      password, // Передаем сырой пароль, он будет хэширован в beforeCreate
      role,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, //Только когда https
      sameSite: 'none', 
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Только когда https
      sameSite: 'none', 
    });

    res.status(201).json({
      message: 'Пользователь успешно зарегестрирован',
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Ошибка регистрации пользователя', error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Необходимы польователь и пароль' });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    const hashedPassword = user.getDataValue('password');

    console.log('/login hashedPassword ', hashedPassword);

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Неверные данные' });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, //Только когда https
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, //Только когда https
      sameSite: 'none', 
    });

    res.json({
      message: 'авторизация успешна',
      accessToken,
      refreshToken,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Ошибка авторизации', error: error.message });
  }
});

router.post(
  '/refresh-token',
  async (req: Request, res: Response): Promise<void> => {
    const { token: refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Необходим refresh токен' });
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
        secure: true, //Только когда https
        sameSite: 'none',
      });

      res.json({ accessToken: newAccessToken });
    } catch (error: any) {
      console.error('Ошибка верифакации refresh токена:', error);
      res
        .status(403)
        .json({ message: 'Невалидный refresh токен', error: error.message });
    }
  }
);

router.delete('/delete-user/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: 'Пользователь удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
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
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления поьзователя' });
  }
});

router.get('/get-users', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Не получилось обновить пользователя' });
  }
});

router.post('/forgot-password', async (req: any, res: any) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = Date.now() + 3600000; // Токен действует 1 час

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    sendResetPassword({
      email,
      name: user.username,
      resetUrl
    })

    res.json({ message: 'Ссылка для сброса пароля отправлена на email' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

router.post('/reset-password/:token', async (req: any, res: any) => {
  const { token } = req.params;
  const { password } = req.body;

  const now = Date.now(); 

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); // Хэшируем токен

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: now }, // Токен должен быть действительным
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Неверный или истекший токен' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});



export default router;

