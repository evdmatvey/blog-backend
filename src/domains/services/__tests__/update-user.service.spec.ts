import { UserEntity } from '@/domains/entities';
import { UpdateUserCommand } from '@/domains/ports/in';
import { UserRepositoryPort } from '@/domains/ports/out';
import { UpdateUserService } from '@/domains/services';

describe('UpdateUserService', () => {
  let userRepositoryPort: UserRepositoryPort;
  let updateUserService: UpdateUserService;
  let user: UserEntity;
  let userId: string;
  let email: string;
  let desc: string;
  let avatar: string;

  beforeEach(() => {
    userRepositoryPort = {
      loadUser: jest.fn(),
      create: jest.fn(),
      updateUser: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };
    updateUserService = new UpdateUserService(userRepositoryPort);

    user = new UserEntity(
      'some-id',
      'nickname',
      'oldemail@example.com',
      'password',
      'old description',
      '/uploads/old-avatar.jpg',
      null,
    );

    userId = 'some-id';
    email = 'newemail@example.com';
    desc = 'new description';
    avatar = '/uploads/new-avatar.jpg';
  });

  afterEach(() => {
    user = null;
    updateUserService = null;
    userId = null;
    email = null;
    desc = null;
    avatar = null;
  });

  it('should update user', async () => {
    const command: UpdateUserCommand = new UpdateUserCommand(
      user.getUserData()._id,
      email,
      desc,
      avatar,
    );

    (userRepositoryPort.loadUser as jest.Mock).mockResolvedValue(user);

    const result = await updateUserService.updateUser(command);

    expect(userRepositoryPort.loadUser).toHaveBeenCalledWith(userId);
    expect(user.getUserData().email).toBe(email);
    expect(user.getUserData().desc).toBe(desc);
    expect(user.getUserData().avatar).toBe(avatar);
    expect(userRepositoryPort.updateUser).toHaveBeenCalledWith(user);
    expect(result).toBe(user);
  });

  it('should throw email error', async () => {
    email = 'wrongemail@n.o';

    const command: UpdateUserCommand = new UpdateUserCommand(
      userId,
      email,
      desc,
      avatar,
    );
    (userRepositoryPort.loadUser as jest.Mock).mockResolvedValue(user);

    try {
      await updateUserService.updateUser(command);
    } catch (error) {
      expect(userRepositoryPort.loadUser).toHaveBeenCalledWith(userId);
      expect(error.message).toBe('Новый email не валиден!');
      expect(user.getUserData().email).toBe('oldemail@example.com');
    }
  });

  it('should throw desc error', async () => {
    desc = new Array(210).fill('1').join('');

    const command: UpdateUserCommand = new UpdateUserCommand(
      userId,
      email,
      desc,
      avatar,
    );
    (userRepositoryPort.loadUser as jest.Mock).mockResolvedValue(user);

    try {
      await updateUserService.updateUser(command);
    } catch (error) {
      expect(userRepositoryPort.loadUser).toHaveBeenCalledWith(userId);
      expect(error.message).toBe(
        'Укажите описание, длина которого меньше 200!',
      );
      expect(user.getUserData().desc).toBe('old description');
    }
  });

  it('should throw avatar error', async () => {
    avatar = 'upload/new-avatar.png';

    const command: UpdateUserCommand = new UpdateUserCommand(
      userId,
      email,
      desc,
      avatar,
    );
    (userRepositoryPort.loadUser as jest.Mock).mockResolvedValue(user);

    try {
      await updateUserService.updateUser(command);
    } catch (error) {
      expect(userRepositoryPort.loadUser).toHaveBeenCalledWith(userId);
      expect(error.message).toBe('Новый аватар не валиден!');
      expect(user.getUserData().avatar).toBe('/uploads/old-avatar.jpg');
    }
  });
});
