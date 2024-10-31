import { Router } from 'express';
import usersRouter from './usersRouter';
import productRouter from './productRouter';
import orderRouter from './orderRouter';
import cartRouter from './cartRouter'

const router = Router();

router.use('/users', usersRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/cart', cartRouter);


export default router;
