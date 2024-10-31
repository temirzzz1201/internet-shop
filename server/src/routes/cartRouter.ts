import { Cart, Product, Images } from '../models';
import { Request, Response, NextFunction } from 'express';
import express from 'express';

const router = express.Router();

interface AddToCartRequest extends Request {
  body: {
    userId: string;
    productId: string;
    quantity: number;
  };
}

interface UpdateCartRequest extends Request {
  params: {
    id: string;
  };
  body: {
    quantity: number;
  };
}

router.post('/add', async (req: AddToCartRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, quantity } = req.body;
    const item = await Cart.create({ userId, productId, quantity });
    res.status(201).json(item);
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    next(error); 
  }
});

router.get('/:userId', async (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const items = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description', 'stock'],
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

    res.status(200).json(items);
  } catch (error) {
    console.error('Ошибка при получении товаров из корзины:', error);
    next(error); 
  }
});

router.put('/update/:id', async (req: any, res: any, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    console.error('Ошибка при обновлении количества товара в корзине:', error);
    next(error); 
  }
});

router.delete('/remove/:id', async (req: any, res: any, next: NextFunction) => {
  try {
    const { id } = req.params;

    const productId = id

    console.log('delete productId ', productId);
    

    const result = await Cart.destroy({
      where: { productId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }

    res.status(200).json({ message: 'Товар удален из корзины' });
  } catch (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    next(error); 
  }
});

router.delete('/remove-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Cart.destroy({
      where: {},
      truncate: true,
    });

    res.status(200).json({ message: 'Все товары удалены!' });
  } catch (error) {
    console.error('Ошибка при удалении всех товаров из корзины:', error);
    next(error);
  }
});

export default router;
