import { PostEntity } from '@/domains/entities/post';

export interface PostRepositoryPort {
  loadPost(id: string): Promise<PostEntity>;
  create(dto): Promise<PostEntity>;
}
