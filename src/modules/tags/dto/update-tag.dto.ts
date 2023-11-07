import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({
    default: 'node.js',
  })
  title: string;
}
