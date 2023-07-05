export class UpdateUserPasswordCommand {
  constructor(private readonly _userId, private readonly _password: string) {}

  public get userId(): string {
    return this._userId;
  }

  public get password(): string {
    return this._password;
  }
}
