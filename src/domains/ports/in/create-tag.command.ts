export class CreateTagCommand {
  constructor(private readonly _id, private readonly _title: string) {}

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }
}
