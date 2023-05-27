import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  create(file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }
}
