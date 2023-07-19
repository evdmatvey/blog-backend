import { RoleEntity, UserEntity } from '@/domains/entities';
import { User } from './entities/user.entity';

type UserData = { _id: string } & User;

export class UserMapper {
  static mapToDomain(user: UserData): UserEntity {
    const role = UserMapper.mapRoleToDomain(user.role);
    return new UserEntity(
      user.email,
      user.password,
      user.desc,
      user.avatar,
      role,
      user._id,
      user.nickname,
    );
  }

  static mapRoleToDomain(role: 'user' | 'author' | 'admin'): RoleEntity {
    switch (role) {
      case 'admin':
        return RoleEntity.ADMIN;
      case 'user':
        return RoleEntity.USER;
      case 'author':
        return RoleEntity.AUTHOR;
    }
  }
}
