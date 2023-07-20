import { RoleEntity } from '@/domains/entities';

export type UserId = string;

export class UserEntity {
  constructor(
    private readonly _id: UserId,
    private readonly _nickname: string,
    private _email: string,
    private _password: string,
    private _desc: string,
    private _avatar: string,
    private _role: RoleEntity,
    private readonly _createdAt?: string,
  ) {}

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
    };
  }

  public updateUserData(desc: string, email: string, avatar: string) {
    this._desc = desc;
    this._email = email;
    this._avatar = avatar;
  }

  public updatePassword(password: string) {
    this._password = password;
  }
}
