import { Router } from 'express';
import { Product } from '../models/index';

const router = Router();

router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post('/', async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = await Product.create({ name, description, price, stock });
  res.json(newProduct);
});

export default router;
