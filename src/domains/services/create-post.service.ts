import { PostEntity } from '../entities';
import { CreatePostCommand, CreatePostUseCase } from '../ports/in';
import { PostRepositoryPort } from '../ports/out';

export class CreatePostService implements CreatePostUseCase {
  constructor(private readonly _postRepository: PostRepositoryPort) {}

  async createPost(command: CreatePostCommand): Promise<PostEntity> {
    try {
      const { id, author, title, desc, image, tags, text, status } = command;
      const post = new PostEntity(
        id,
        author,
        title,
        desc,
        image,
        tags,
        text,
        status,
      );

      const data = post.create();
      const createdPost = await this._postRepository.create(data);

      return createdPost;
    } catch (error) {
      throw error;
    }
  }
}
