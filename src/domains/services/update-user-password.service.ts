import { Validation } from '@/utils/validation';
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
    const isNewPasswordValid = new Validation<typeof command>(command).validate(
      'password',
      {
        required: 'Укажите новый пароль!',
        length: {
          min: 6,
          max: 24,
          errorMessage: 'Длина нового пароля должна быть от 6 до 24 симболов!',
        },
      },
    );

    if (isNewPasswordValid) {
      user.updatePassword(command.password);

      await this._userRepository.updateUser(user);

      return user;
    }
  }
}
