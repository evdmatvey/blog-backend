import { Validation } from '@/utils/validation';
import { UserEntity } from '@/domains/entities';
import { UpdateUserCommand, UpdateUserUseCase } from '@/domains/ports/in';
import { UserRepositoryPort } from '../ports/out/user-repository.port';

export class UpdateUserService implements UpdateUserUseCase {
  constructor(private _userRepository: UserRepositoryPort) {}

  async updateUser(command: UpdateUserCommand): Promise<UserEntity> {
    const { avatar, desc, email, userId } = command;
    const user = await this._userRepository.loadUser(userId);
    const userValidation = new Validation<typeof command>(command);
    userValidation.validate('desc', {
      length: {
        min: 0,
        max: 200,
        errorMessage: 'Укажите описание, длина которого меньше 200!',
      },
    });
    userValidation.validate('avatar', {
      filepath: 'Новый аватар не валиден!',
    });
    userValidation.validate('email', {
      email: 'Новый email не валиден!',
    });

    user.updateUserData(desc, email, avatar);

    await this._userRepository.updateUser(user);

    return user;
  }
}
