import { Router, Request, Response } from 'express';
import { Product } from '../models/index';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const products = await Product.findAll();
  res.json(products);
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, stock } = req.body;
  const newProduct = await Product.create({ name, description, price, stock });
  res.json(newProduct);
});

export default router;
