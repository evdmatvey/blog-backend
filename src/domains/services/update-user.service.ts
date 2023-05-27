import { UserEntity } from '@/domains/entities';
import { UpdateUserCommand, UpdateUserUseCase } from '@/domains/ports/in';
import { UserRepositoryPort } from '../ports/out/user-repository.port';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(private _userRepository: UserRepositoryPort) {}

  async updateUser(command: UpdateUserCommand): Promise<UserEntity> {
    const user = await this._userRepository.loadUser(command.userId);

    user.updateUserEmail(command.email);
    user.updateUserDesc(command.desc);
    user.updateUserAvatar(command.avatar);

    await this._userRepository.updateUser(user);

    return user;
  }
}
