import { UpdateUserPasswordService } from '../update-user-password.service';
import { UserEntity } from '@/domains/entities';
import { UpdateUserPasswordCommand } from '@/domains/ports/in/update-user-password.command';
import { UserRepositoryPort } from '@/domains/ports/out';

describe('UpdateUserPasswordService', () => {
  const userId: string = 'some-id';
  let userRepositoryPort: UserRepositoryPort;
  let updateUserPasswordService: UpdateUserPasswordService;
  let user: UserEntity;

  beforeEach(() => {
    userRepositoryPort = {
      loadUser: jest.fn(),
      create: jest.fn(),
      updateUser: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };
    updateUserPasswordService = new UpdateUserPasswordService(
      userRepositoryPort,
    );

    user = new UserEntity(
      userId,
      'nickname',
      'some@example.com',
      'oldpassword',
      'old description',
      '/uploads/old-avatar.jpg',
      null,
    );
  });

  afterEach(() => {
    user = null;
    updateUserPasswordService = null;
  });

  it('should update password', async () => {
    const password = 'newpassword';
    const command: UpdateUserPasswordCommand = new UpdateUserPasswordCommand(
      user.getUserData().id,
      password,
    );

    (userRepositoryPort.loadUser as jest.Mock).mockResolvedValue(user);

    const result = await updateUserPasswordService.updateUserPassword(command);

    expect(userRepositoryPort.loadUser).toHaveBeenCalledWith(userId);
    expect(user.getUserData().password).toBe(password);
    expect(userRepositoryPort.updateUser).toHaveBeenCalledWith(user);
    expect(result).toBe(user);
  });

  it('should throw password error', async () => {
    const password = 'new password';
    const command: UpdateUserPasswordCommand = new UpdateUserPasswordCommand(
      user.getUserData().id,
      password,
    );

    (userRepositoryPort.loadUser as jest.Mock).mockResolvedValue(user);

    try {
      await updateUserPasswordService.updateUserPassword(command);
    } catch (error) {
      expect(userRepositoryPort.loadUser).toHaveBeenCalledWith(userId);
      expect(error.message).toBe('Новый пароль не валиден');
      expect(user.getUserData().password).toBe('oldpassword');
    }
  });
});
