import { UserEntity } from '@/domains/entities';

interface CreateUserDto {
  email: string;
  nickname: string;
  password: string;
}

export interface UserRepositoryPort {
  updateUser(user: UserEntity);
  loadUser(userId: string): Promise<UserEntity>;
  findById(id: string);
  findByEmail(email: string);
  create(dto: CreateUserDto);
}
