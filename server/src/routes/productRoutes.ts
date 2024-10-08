import { Router, Request, Response } from 'express';
import Product from '../models/ProductModel';
import Category from '../models/CategoryModel';
import upload from '../middleware/upload';


const router = Router();

router.get('/all-products', async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({ include: Category });
    res.json(products);
    return
  } catch (error) {

    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});

router.post('/create-product', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, stock, categoryId } = req.body;

  if (!req.file) {
    res.status(400).send({ message: 'No file uploaded' });
    return;
  }

  try {
    const newProduct = await Product.create({
      categoryId,
      name,
      description,
      price,
      stock,
      imageUrl: req.file.filename,
    });

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

router.delete('/delete-product/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    await Product.destroy({ where: { id: productId } });
    res.status(200).json({ message: 'Продукт удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении продукта' });
  }
});


router.put('/update-product/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const product = await Product.findByPk(productId);

    if (product) {
      await product.update(updates);
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Продукт не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении продукта' });
  }
});


router.get('/all-categories', async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
    return
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
});

router.post('/create-category', async (req: Request, res: Response) => {
  const { categoryName } = req.body;
  try {
    const category = await Category.create({ categoryName });
    res.json(category);
    return
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
});

export default router;
