interface CreateTagRequest {
  title: string;
}

type CreateTagResponse = CreateTagRequest;

export interface TagData {
  _id: string;
  title: string;
}

export class TagEntity {
  constructor(private readonly _id: string, private _title: string) {}

  static create(data: CreateTagRequest): CreateTagResponse {
    return { title: data.title };
  }

  public getTagData(): TagData {
    return {
      _id: this._id,
      title: this._title,
    };
  }

  public update(title: string) {
    this._title = title;
  }

  public isSought(search: string) {
    return this._title.includes(search);
  }
}
