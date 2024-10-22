// import multer from 'multer';
// import path from 'path';

// // Абсолютный путь к директории uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadsDir = path.join(__dirname, '..', 'uploads');  
//     cb(null, uploadsDir); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);  
//   },
// });

// const fileFilter = (req: any, file: any, cb: any) => {
//   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//   if (!allowedTypes.includes(file.mimetype)) {
//     cb(new Error('Only images are allowed'), false);
//   } else {
//     cb(null, true);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 1024 * 1024 * 5 }, 
// });

// export default upload;



import multer, { MulterError } from 'multer';
import path from 'path';

// Абсолютный путь к директории uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Уникальное имя файла с использованием временной метки и оригинального имени
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Фильтр для проверки типов файлов
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    // Используем `any` для ошибки
    cb(new (MulterError as any)('LIMIT_UNEXPECTED_FILE', file.fieldname), false);
  } else {
    cb(null, true);
  }
};

// Ограничения на размер загружаемых файлов и настройка multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Максимальный размер файла 5MB
});

// Экспортируем middleware
export default upload;

