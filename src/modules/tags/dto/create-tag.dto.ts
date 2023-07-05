import { ApiProperty } from '@nestjs/swagger';
export class CreateTagDto {
  @ApiProperty({
    default: 'node.js',
  })
  title: string;
}
