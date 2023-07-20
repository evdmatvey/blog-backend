import { PostEntity } from '@/domains/entities';

export interface PostRepositoryPort {
  loadPost(id: string): Promise<PostEntity>;
  create(dto);
}
