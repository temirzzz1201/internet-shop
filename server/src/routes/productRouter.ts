import { Router, Request, Response } from 'express';
import Product from '../models/ProductModel';
import Image from '../models/ProductImage';
import Category from '../models/CategoryModel';
import upload from '../middleware/upload';

const router = Router();

router.get('/all-products', async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: Image,
          as: 'images',
        },
      ],
    });

    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({ message: 'Продукты не найдены' });
    }
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});


router.post('/create-product', upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
    });

    if (req.files && Array.isArray(req.files)) {
      const imageUrls = (req.files as Express.Multer.File[]).map(file => file.filename);

      await Image.bulkCreate(
        imageUrls.map(url => ({
          productId: newProduct.id, 
          imageUrl: url,
        }))
      );
    }

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});


router.get('/all-images', async (req: Request, res: Response) => {
  try {
    const images = await Image.findAll();
    res.json(images);
    return
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении категорий' });
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
    const category = await Category.create( {name: categoryName} );

    res.json(category);
    return
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании категории' });
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

export default router;
