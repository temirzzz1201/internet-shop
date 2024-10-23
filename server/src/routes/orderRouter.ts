import { Router } from 'express';
import { Order } from '../models/index';

const router = Router();

router.get('/get-all', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

router.post('/create-order', async (req, res) => {
  try {
    const { quantity, total_price, userId, productId } = req.body;

    const newOrder = await Order.create({ quantity, total_price, userId, productId });
    res.json(newOrder);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

export default router;
