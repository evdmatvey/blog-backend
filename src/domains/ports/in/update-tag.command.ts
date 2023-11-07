export class UpdateTagCommand {
  constructor(private readonly _id: string, private readonly _title: string) {}

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }
}
