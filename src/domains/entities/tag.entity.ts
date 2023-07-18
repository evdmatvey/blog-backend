interface CreateTagRequest {
  title: string;
}

type CreateTagResponse = CreateTagRequest;

export class TagEntity {
  constructor(private readonly _id: string, private _title: string) {}

  static create(data: CreateTagRequest): CreateTagResponse {
    return { title: data.title };
  }

  public getTagData() {
    return {
      id: this._id,
      title: this._title,
    };
  }

  public update(title: string) {
    this._title = title;
  }
}
