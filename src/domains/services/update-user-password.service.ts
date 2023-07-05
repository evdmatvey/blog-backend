import { UpdateUserPasswordCommand } from '../ports/in/update-user-password.command';
import { UpdateUserPasswordUseCase } from '../ports/in/update-user-password.use-case';
import { UserRepositoryPort } from '../ports/out';
import { UserEntity } from '../entities';

export class UpdateUserPasswordService implements UpdateUserPasswordUseCase {
  constructor(private readonly _userRepository: UserRepositoryPort) {}

  async updateUserPassword(
    command: UpdateUserPasswordCommand,
  ): Promise<UserEntity> {
    const user = await this._userRepository.loadUser(command.userId);
    user.updatePassword(command.password);

    await this._userRepository.updateUser(user);

    return user;
  }
}
