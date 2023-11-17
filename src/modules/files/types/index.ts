import { ApiProperty } from '@nestjs/swagger';

export class CreateFileResponse {
  @ApiProperty({ example: '/uploads/b3151c11dc4f1761010a.png' })
  url: string;
}

export class DeleteFileResponse {
  @ApiProperty({ example: 'Файл успешно удалён' })
  msg: 'Файл успешно удалён';
}
