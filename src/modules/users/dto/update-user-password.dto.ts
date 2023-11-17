import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'new password' })
  password: string;
}
