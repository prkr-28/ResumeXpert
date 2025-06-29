import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//file filter...$
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['images/jpeg', 'images/png', 'images/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('only jpeg png jpg formats are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
