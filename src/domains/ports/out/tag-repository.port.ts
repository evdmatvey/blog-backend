import { TagEntity } from '@/domains/entities';

export interface TagRepositoryPort {
  loadTag(id: string): Promise<TagEntity>;
  create(title: string);
}
