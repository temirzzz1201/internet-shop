import { Router, Request, Response } from 'express';
import upload from '../middleware/upload';

const router = Router();

router.post('/upload-product', upload.single('image'), async (req: Request, res: Response): Promise<void> => {

  if (!req.file) {
    res.status(400).send({ message: 'No file uploaded' });
    return;
  }

  try {

  } catch (error) {
    res.status(500).json({ error: 'Failed to upload product' });
  }
});


export default router;




