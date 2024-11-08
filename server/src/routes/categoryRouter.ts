import { Router, Request, Response } from 'express';
import Category from '../models/CategoryModel';

const router = Router();

router.get('/all-categories', async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
});

router.post('/create-category', async (req: Request, res: Response) => {
  const { categoryName } = req.body;
  try {
    const category = await Category.create({ name: categoryName });

    res.json(category);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
});

export default router;
