export class UpdateUserCommand {
  constructor(
    private readonly _userId: string,
    private readonly _email: string,
    private readonly _desc: string,
    private readonly _avatar: string,
  ) {}

  public get userId(): string {
    return this._userId;
  }

  public get email(): string {
    return this._email;
  }

  public get desc(): string {
    return this._desc;
  }

  public get avatar(): string {
    return this._avatar;
  }
}
