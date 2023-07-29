import { TagEntity, UserId } from '@/domains/entities';
import { PostStatus } from '@/domains/entities';
import { User } from '@/modules/users/entities/user.entity';

export class CreatePostCommand {
  constructor(
    private readonly _authorId: UserId,
    private readonly _title: string,
    private readonly _desc: string,
    private readonly _image: string,
    private readonly _tags: string[],
    private readonly _text: string,
    private readonly _status: PostStatus,
  ) {}

  public get authorId(): UserId {
    return this._authorId;
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

  public get tags(): string[] {
    return this._tags;
  }

  public get text(): string {
    return this._text;
  }

  public get status(): PostStatus {
    return this._status;
  }
}
