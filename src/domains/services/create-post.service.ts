import { Validation } from '@/utils/validation';
import { PostEntity } from '@/domains/entities';
import { CreatePostCommand, CreatePostUseCase } from '../ports/in';
import { PostRepositoryPort } from '../ports/out';

export class CreatePostService implements CreatePostUseCase {
  constructor(private readonly _postRepository: PostRepositoryPort) {}

  async createPost(command: CreatePostCommand): Promise<PostEntity> {
    try {
      const postValidation = new Validation<typeof command>(command);
      postValidation.validate('title', {
        length: {
          min: 10,
          errorMessage:
            'Длина названия новой статьи должна быть больше 10 симболов!',
        },
      });

      postValidation.validate('desc', {
        length: {
          min: 30,
          errorMessage:
            'Длина описания новой статьи должна быть больше 30 симболов!',
        },
      });

      postValidation.validate('text', {
        length: {
          min: 200,
          errorMessage:
            'Длина текста новой статьи должна быть больше 200 симболов!',
        },
      });
      const { authorId, desc, image, status, tags, text, title } = command;

      const createdPost = await this._postRepository.create({
        authorId,
        desc,
        image,
        status,
        tags,
        text,
        title,
      });

      return createdPost;
    } catch (error) {
      throw error;
    }
  }
}
