import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@test.test',
  })
  email: string;

  @ApiProperty({
    default: 'Test',
  })
  nickname: string;

  @ApiProperty({
    default: 'test01',
  })
  password: string;
}
