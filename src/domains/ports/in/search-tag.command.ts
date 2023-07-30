export class SearchTagCommand {
  constructor(private readonly _search: string) {}

  public get search(): string {
    return this._search;
  }
}
