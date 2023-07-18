import { Validation } from '../validation';

interface MockUser {
  nickname: string;
  password: string;
  email: string;
  desc: string;
}

describe('Validation', () => {
  it('required | result should be false', () => {
    const user = { name: '' };
    const isUserNameValid = () =>
      new Validation<typeof user>(user).validate('name', {
        required: 'Укажите имя',
      });

    expect(isUserNameValid).toThrow('Укажите имя');
  });

  it('required | result should be false again', () => {
    const user = { name: '  ' };
    const isUserNameValid = () =>
      new Validation<typeof user>(user).validate('name', {
        required: 'Укажите имя',
      });

    expect(isUserNameValid).toThrow('Укажите имя');
  });

  it('required | result should be true', () => {
    const user = { name: 'name' };
    const isUserNameValid = new Validation<typeof user>(user).validate('name', {
      required: 'Укажите имя',
    });

    expect(isUserNameValid).toBe(true);
  });

  it('length | result should be false', () => {
    const user = { name: 'name' };
    const isUserNameValid = () =>
      new Validation<typeof user>(user).validate('name', {
        length: {
          min: 5,
          max: 10,
          errorMessage: 'Укажите имя, длина которого больше 5, но меньше 10',
        },
      });

    expect(isUserNameValid).toThrow(
      'Укажите имя, длина которого больше 5, но меньше 10',
    );
  });

  it('length | result should be false again', () => {
    const user = { name: 'name' };
    const isUserNameValid = () =>
      new Validation<typeof user>(user).validate('name', {
        length: {
          min: 1,
          max: 3,
          errorMessage: 'Укажите имя, длина которого больше 1, но меньше 3',
        },
      });

    expect(isUserNameValid).toThrow(
      'Укажите имя, длина которого больше 1, но меньше 3',
    );
  });

  it('length | result should be true', () => {
    const user = { name: 'me' };
    const isUserNameValid = new Validation<typeof user>(user).validate('name', {
      length: {
        min: 1,
        max: 3,
        errorMessage: 'Укажите имя, длина которого больше 1, но меньше 3',
      },
    });
    expect(isUserNameValid).toBe(true);
  });

  it('email | result should be false', () => {
    const user = { email: 'em@ai.l' };
    const isUserEmailValid = () =>
      new Validation<typeof user>(user).validate('email', {
        email: 'Укажите корректный email!',
      });

    expect(isUserEmailValid).toThrow('Укажите корректный email!');
  });

  it('email | result should be true', () => {
    const user = { email: 'mymail@mail.my' };
    const isUserEmailValid = new Validation<typeof user>(user).validate(
      'email',
      {
        email: 'Укажите корректный email!',
      },
    );

    expect(isUserEmailValid).toBe(true);
  });

  it('filepath | result should be false', () => {
    const user = { avatar: '/uploadds/picture.png' };
    const isUserFilepathValid = () =>
      new Validation<typeof user>(user).validate('avatar', {
        filepath:
          'Прошзошла ошибка. Попробуйте ещё раз или обратитесь в поддержку',
      });

    expect(isUserFilepathValid).toThrow(
      'Прошзошла ошибка. Попробуйте ещё раз или обратитесь в поддержку',
    );
  });

  it('filepath | result should be true', () => {
    const user = { avatar: '/uploads/picture.png' };
    const isUserFilepathValid = new Validation<typeof user>(user).validate(
      'avatar',
      {
        filepath:
          'Прошзошла ошибка. Попробуйте ещё раз или обратитесь в поддержку',
      },
    );

    expect(isUserFilepathValid).toBe(true);
  });

  it('prefix', () => {
    const user = { name: 'me' };
    const userNameWithPrefix = new Validation<typeof user>(user).addPrefix(
      'name',
      { value: '@', regExp: /@/g },
    );

    expect(userNameWithPrefix).toBe('@me');
  });

  it('several fields check | results should be true', () => {
    const user: MockUser = {
      nickname: 'name',
      desc: 'my desc',
      email: 'mymail@mail.my',
      password: '1234567',
    };

    const userValidation = new Validation<MockUser>(user);
    const isUserNameValid = userValidation.validate('nickname', {
      length: {
        min: 3,
        max: 12,
        errorMessage: 'Укажите имя, длина которого больше 3, но меньше 12',
      },
    });
    const isUserPasswordValid = userValidation.validate('password', {
      length: {
        min: 6,
        max: 24,
        errorMessage: 'Укажите пароль, длина которого больше 5, но меньше 25',
      },
    });
    const isUserEmailValid = userValidation.validate('email', {
      email: 'Укажите корректный email!',
    });
    const isUserDescValid = userValidation.validate('desc', {
      required: 'Укажите описание',
    });

    expect(isUserNameValid).toBe(true);
    expect(isUserDescValid).toBe(true);
    expect(isUserEmailValid).toBe(true);
    expect(isUserPasswordValid).toBe(true);
  });
});
