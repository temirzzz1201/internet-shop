import { Router, Request, Response } from 'express';
import Product from '../models/ProductModel';
import Image from '../models/ProductImage';
import Category from '../models/CategoryModel';
import upload from '../middleware/upload';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/all-products', async (req: Request, res: Response) => {
  const { page = 1, limit = 30 } = req.query;

  try {
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: products } = await Product.findAndCountAll({
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
      offset,
      limit: Number(limit),
    });

    const totalPages = Math.ceil(count / Number(limit));

    res.json({
      products,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});

router.get('/find-one', async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10);

  try {
    const product = await Product.findOne({
      where: { id },
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

    res.json({
      product,
    });
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});

router.post(
  '/create-product',
  upload.array('images', 5),
  async (req: Request, res: Response) => {
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
        const imageUrls = (req.files as Express.Multer.File[]).map((file) => {
          const tempPath = path.join(__dirname, '..', 'uploads', file.filename); 
          const finalPath = path.join('/var/www/uploads', file.filename); 

          // Перемещаем файл в /var/www/uploads
          fs.renameSync(tempPath, finalPath);

          // Удаляем файл из временной директории
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }

          // Путь, который будет использоваться для доступа к изображению
          return `${file.filename}`;
        });

        // Сохраняем записи о картинках в таблице Image
        await Image.bulkCreate(
          imageUrls.map((url) => ({
            productId: newProduct.id,
            imageUrl: url,
          }))
        );
      }

      res
        .status(201)
        .json({ message: 'Продукт успешно создан', product: newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка создания продукта' });
    }
  }
);

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
