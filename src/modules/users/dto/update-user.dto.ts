import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'newemail@gmail.co' })
  email: string;

  @ApiProperty({ example: 'new desc' })
  desc: string;

  @ApiProperty({ example: 'new avatar' })
  avatar: string;
}
