import { PostEntity } from '@/domains/entities';
import { Post } from './entities/post.entity';

type PostData = { _id: string } & Post;

export class PostMapper {
  public static mapToDomain(data: PostData): PostEntity {
    const { _id, author, desc, image, status, tags, text, title } = data;
    const mappedTags = tags.map((tag) => tag.valueOf() as string);

    return new PostEntity(
      _id,
      author.valueOf() as string,
      title,
      desc,
      image,
      mappedTags,
      text,
      status,
    );
  }
}
