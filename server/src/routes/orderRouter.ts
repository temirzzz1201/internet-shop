import { Router } from 'express';
import { Order, User } from '../models/index';
import sendOrderEmails from '../utils/nodemailer';

const router = Router();

interface IUserOrder {
  quantity: number, 
  total_price: number, 
  userId: number,
  productId: number,
}

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

    const user = await User.findOne({where: userId})

    const orderDetails: IUserOrder = {
      quantity, 
      total_price, 
      userId, 
      productId
    }

    const newOrder = await Order.create({ quantity, total_price, userId, productId });

    sendOrderEmails({ userEmail: user!.email, orderDetails });

    res.json(newOrder);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
});

export default router;
