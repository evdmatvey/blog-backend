import { TagEntity } from '@/domains/entities';
import { PostStatus } from '@/domains/entities';

export class CreatePostCommand {
  constructor(
    private readonly _id: string,
    private readonly _author: string,
    private readonly _title: string,
    private readonly _desc: string,
    private readonly _image: string,
    private readonly _tags: TagEntity[],
    private readonly _text: string,
    private readonly _status: PostStatus,
  ) {}

  public get id(): string {
    return this._id;
  }

  public get author(): string {
    return this._author;
  }

  public get title(): string {
    return this._title;
  }

  public get desc(): string {
    return this._desc;
  }

  public get image(): string {
    return this._image;
  }

  public get tags(): TagEntity[] {
    return this._tags;
  }

  public get text(): string {
    return this._text;
  }

  public get status(): PostStatus {
    return this._status;
  }
}
