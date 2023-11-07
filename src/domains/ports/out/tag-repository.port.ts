import { TagEntity } from '@/domains/entities';

interface CreateTagDto {
  title: string;
}

export interface TagRepositoryPort {
  loadTag(id: string): Promise<TagEntity>;
  loadTags(): Promise<TagEntity[]>;
  create(dto: CreateTagDto);
  update(id: string, title: string): Promise<TagEntity>;
}
