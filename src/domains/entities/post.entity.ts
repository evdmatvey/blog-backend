import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

export type PostStatus = 'approved' | 'preview';

export class PostEntity {
  constructor(
    private readonly _id: string,
    private readonly _author: string,
    private _title: string,
    private _desc: string,
    private _image: string,
    private _tags: TagEntity[],
    private _text: string,
    private _status: PostStatus,
  ) {}

  private readonly _lengthRules = { title: 10, desc: 30, text: 100 };

  public getPostData() {
    const tags = this._tags.map((tag) => tag.getTagData());
    return {
      id: this._id,
      author: this._author,
      title: this._title,
      desc: this._desc,
      image: this._image,
      text: this._text,
      status: this._status,
      tags,
    };
  }

  public changePostStatus(status: PostStatus) {
    if (status === 'preview') this._status = 'preview';
    if (status === 'approved') this._status = 'approved';
  }

  public create() {
    if (
      this._validatePostDesc() &&
      this._validatePostTitle() &&
      this._validatePostText()
    ) {
      this.changePostStatus('preview');
      const { id, ...data } = this.getPostData();
      return data;
    }
  }

  private _validatePostText() {
    if (this._text.length < this._lengthRules.text) {
      return this._throwLengthError('текста', this._lengthRules.text);
    }
    return true;
  }

  private _validatePostTitle() {
    if (this._title.length < this._lengthRules.title) {
      return this._throwLengthError('названия', this._lengthRules.title);
    }
    return true;
  }

  private _validatePostDesc() {
    if (this._desc.length < this._lengthRules.desc) {
      return this._throwLengthError('описания', this._lengthRules.desc);
    }
    return true;
  }

  private _throwLengthError(errorField: string, lengthAmount: number) {
    throw new Error(
      `Длина ${errorField} статьи должна быть больше ${lengthAmount}`,
    );
  }
}
