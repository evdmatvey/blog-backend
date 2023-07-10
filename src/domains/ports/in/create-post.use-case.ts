import { PostEntity } from '@/domains/entities';
import { CreatePostCommand } from './create-post.command';

export const CreatePostUseCaseSymbol = Symbol('CreatePostUseCaseSymbol');

export interface CreatePostUseCase {
  createPost(command: CreatePostCommand): Promise<PostEntity>;
}
