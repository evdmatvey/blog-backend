import { diskStorage } from 'multer';

const generatedId = () =>
  Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

const normalizeFileName = (req, file: Express.Multer.File, callback) => {
  const fileExtName = file.originalname.split('.').pop();

  callback(null, `${generatedId()}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: './uploads',
  filename: normalizeFileName,
});
