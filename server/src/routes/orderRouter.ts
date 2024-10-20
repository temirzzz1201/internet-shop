import { Router } from 'express';
import { Order } from '../models/index';

const router = Router();

router.get('/', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

router.post('/', async (req, res) => {
  const { quantity, total_price, userId, productId } = req.body;
  const newOrder = await Order.create({ quantity, total_price, userId, productId });
  res.json(newOrder);
});

export default router;
