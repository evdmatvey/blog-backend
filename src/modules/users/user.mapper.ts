import { RoleEntity, UserEntity } from '@/domains/entities';
import { UserOrmEntity } from './entities/user.entity';

export class UserMapper {
  static mapToDomain(user: UserOrmEntity): UserEntity {
    const role = UserMapper.mapRoleToDomain(user.role);
    return new UserEntity(
      user.email,
      user.password,
      user.desc,
      user.avatar,
      role,
      user.id,
      user.nickname,
      user.createdAt,
      user.updatedAt,
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
