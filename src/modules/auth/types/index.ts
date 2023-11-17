import { ApiProperty } from '@nestjs/swagger';

export class LoginAndRegisterUserResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YmI0OTZmNWQwY',
  })
  token: string;
}
