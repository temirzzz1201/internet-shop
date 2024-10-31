import { Router } from 'express';
import { Order, User, Product, Images } from '../models/index';
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

router.get('/get-user-order', async (req, res) => {
  const { userId } = req.query; 
  console.log('User ID: ', userId);
  
  try {
    const userOrders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'description'], 
          include: [
            {
              model: Images,
              as: 'images',
              attributes: ['imageUrl'], 
            },
          ],
        },
      ],
    });

    console.log('userOrders ', userOrders);
    
    res.json(userOrders);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ message: 'Ошибка при получении заказов пользователя' });
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
