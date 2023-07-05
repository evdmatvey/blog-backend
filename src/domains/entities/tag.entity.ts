export class TagEntity {
  constructor(private readonly _id: string, private _title: string) {}

  public getTagData() {
    return {
      id: this._id,
      title: this._title,
    };
  }

  public create() {
    if (!this._validateTitle(this._title)) {
      return this._throwTitleLengthError();
    }
    this._title = this._normalizeTitle(this._title);
  }

  public update(title: string) {
    if (this._validateTitle(title)) {
      title = this._normalizeTitle(title);
      this._title = title;
    } else {
      return this._throwTitleLengthError();
    }
  }

  private _normalizeTitle(title: string) {
    if (title.includes('#')) {
      title = title.replace(/#/g, '').trim();
    }
    return '#' + title;
  }

  private _validateTitle(title: string) {
    if (title.trim().length <= 1) {
      return false;
    }

    return true;
  }

  private _throwTitleLengthError(): never {
    throw new Error('Длина названия тега должна быть больше 1');
  }
}
