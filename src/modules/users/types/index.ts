import { RoleEntity } from '@/domains/entities';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: '64bb496f5d0c6476d977bd93' })
  _id: string;

  @ApiProperty({ example: 'evd.matvey@mail.ru' })
  email: string;

  @ApiProperty({ example: '@evd.matvey' })
  nickname: string;

  @ApiProperty({ example: 'matvey2005' })
  password: string;

  @ApiProperty({ example: RoleEntity.USER })
  desc: string;

  @ApiProperty({ example: 'admin' })
  role: RoleEntity;

  @ApiProperty({ example: '/uploads/99e7b94b8f7473d027.jpg' })
  avatar: string;

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  updatedAt: string;
}
