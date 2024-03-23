import { UserId } from './user.entity';

export type PostStatus = 'approved' | 'preview';

export class PostEntity {
  constructor(
    private readonly _id: string,
    private readonly _authorId: UserId,
    private _title: string,
    private _desc: string,
    private _image: string,
    private _tags: string[],
    private _text: string,
    private _status: PostStatus,
    private _createdAt?: Date,
  ) {}

  public getPostData() {
    return {
      _id: this._id,
      authorId: this._authorId,
      title: this._title,
      desc: this._desc,
      image: this._image,
      text: this._text,
      status: this._status,
      tags: this._tags,
      createdAt: this._createdAt,
    };
  }

  public changePostStatus(status: PostStatus) {
    if (status === 'preview') this._status = 'preview';
    if (status === 'approved') this._status = 'approved';
  }
}
