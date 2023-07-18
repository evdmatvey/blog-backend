import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    default: 'test@test.test',
  })
  email: string;

  @ApiProperty({
    default: 'test01',
  })
  password: string;
}
