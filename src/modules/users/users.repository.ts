import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOrmEntity } from './entities/user.entity';
import { UserEntity } from '@/domains/entities';
import { UserMapper } from './user.mapper';
import { UserRepositoryPort } from '@/domains/ports/out/user-repository.port';

@Injectable()
export class UsersRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private repository: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async loadUser(id: string): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id });
    return UserMapper.mapToDomain(user);
  }

  async create(dto: CreateUserDto) {
    return this.repository.save({
      ...dto,
      role: 'user',
      avatar: '/uploads/avatar.jpg',
      desc: '',
    });
  }

  async updateUser(user: UserEntity) {
    try {
      const updatedUser = user.getUserData();
      await this.repository.update(user.id, updatedUser);

      return updatedUser;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
