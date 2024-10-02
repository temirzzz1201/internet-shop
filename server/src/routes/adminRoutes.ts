import { Router, Request, Response } from 'express';
import ProductModel from '../models/ProductModel';
import upload from '../middleware/upload';

const router = Router();

router.post('/upload-product', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, stock } = req.body;

  if (!req.file) {
    res.status(400).send({ message: 'No file uploaded' });
    return;
  }

  try {
    const newProduct = await ProductModel.create({
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

export default router;
