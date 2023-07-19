export class CreateTagCommand {
  constructor(private readonly _title: string) {}

  public get title(): string {
    return this._title;
  }
}
