import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '@/domains/entities';
import { UserRepositoryPort } from '@/domains/ports/out';
import { CreateUserDto } from './dto/create-user.dto';
import { User, userDocument } from './entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(User.name)
    private readonly _repository: Model<userDocument>,
  ) {}

  async findByEmail(email: string) {
    return this._repository.findOne({ email });
  }

  async findById(id: string) {
    return this._repository.findById(id);
  }

  async loadUser(id: string): Promise<UserEntity> {
    const user = await this._repository.findById(id);
    return UserMapper.mapToDomain(user);
  }

  async create(dto: CreateUserDto) {
    return this._repository.create(dto);
  }

  async getAll() {
    return this._repository.find();
  }

  async updateUser(user: UserEntity) {
    try {
      const updatedUser = user.getUserData();
      const currentUser = await this._repository.findById(updatedUser._id);

      currentUser.email = updatedUser.email;
      currentUser.password = updatedUser.password;
      currentUser.desc = updatedUser.desc;
      currentUser.avatar = updatedUser.avatar;

      await currentUser.save();

      return updatedUser;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
