import { Router } from 'express';
import adminRouter from './adminRouter';
import usersRouter from './usersRouter';
import productRouter from './productRouter';
import orderRouter from './orderRouter';

const router = Router();

router.use('/admin', adminRouter);
router.use('/users', usersRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);

export default router;
