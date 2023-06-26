import { RoleEntity } from '@/domains/entities';

const USER_CONFIG = {
  desc: {
    maxLength: 200,
    links: ['http', 'https'],
  },
  password: {
    minLength: 6,
    maxLength: 24,
  },
  email: {
    minLength: 8,
  },
  avatar: {
    dir: '/uploads/',
  },
};

export class UserEntity {
  constructor(
    private _email: string,
    private _password: string,
    private _desc: string,
    private _avatar: string,
    private _role: RoleEntity,
    private readonly _id: string,
    private readonly _nickname: string,
    private readonly _createdAt?: string,
    private readonly _updatedAt?: string,
  ) {}

  public get id() {
    return this._id;
  }

  public getUserData() {
    return {
      id: this._id,
      email: this._email,
      nickname: this._nickname,
      password: this._password,
      desc: this._desc,
      avatar: this._avatar,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public updateUserDesc(desc: string): void | never {
    if (this._validateUserDesc(desc)) {
      this._desc = desc;
    } else {
      throw new Error('Новое описание не валидно');
    }
  }

  public updatePassword(password: string): void | never {
    if (this._validateUserPassword(password)) {
      this._password = password;
    } else {
      throw new Error('Новый пароль не валиден');
    }
  }

  public updateUserEmail(email: string): void | never {
    if (this._validateUserEmail(email)) {
      this._email = email;
    } else {
      throw new Error('Новый email не валиден');
    }
  }

  public updateUserAvatar(avatar: string): void | never {
    if (this._validateUserAvatar(avatar)) {
      this._avatar = avatar;
    } else {
      throw new Error('Новый аватар не валиден');
    }
  }

  private _validateUserEmail(email: string): boolean {
    const isEmailLengthValid = email.length >= USER_CONFIG.email.minLength;
    const isEmailTruthy = email.match(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    );

    return isEmailTruthy && isEmailLengthValid;
  }

  private _validateUserPassword(password: string): boolean {
    const isPasswordAnother = password !== this._password;
    const isPasswordLengthValid =
      password.length >= USER_CONFIG.password.minLength &&
      password.length <= USER_CONFIG.password.maxLength;

    const isSpacesInPassword = [...password].includes(' ');

    return isPasswordAnother && isPasswordLengthValid && !isSpacesInPassword;
  }

  private _validateUserDesc(desc: string): boolean {
    const isDescLengthValid = desc.length <= USER_CONFIG.desc.maxLength;
    let isBannedWordsInDesc = false;
    let isLinkInDesc = false;

    USER_CONFIG.desc.links.forEach((link) => {
      if (desc.includes(link)) {
        isLinkInDesc = true;
      }
    });

    return !isBannedWordsInDesc && isDescLengthValid && !isLinkInDesc;
  }

  private _validateUserAvatar(avatar: string): boolean {
    const isAvatarInRightDir = avatar.includes(USER_CONFIG.avatar.dir);

    return isAvatarInRightDir;
  }
}
