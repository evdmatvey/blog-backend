import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  create(file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  delete(filename: string) {
    fs.unlink(`uploads/${filename}`, (error) => {
      if (error) throw new Error('Ошибка при удалении файла');
    });

    return { msg: 'Файл успешно удалён' };
  }
}
