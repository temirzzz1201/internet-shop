import express from 'express';
import path from 'path';
import cors from 'cors';
import { initModels } from './models';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3600;

app.use(cors())

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', router);

const start = async () => {
  try {
    await initModels();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
