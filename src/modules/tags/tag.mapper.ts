import { TagEntity } from '@/domains/entities';
import { TagOrmEntity } from './entities/tag.entity';

export class TagMapper {
  static mapToDomain(tag: TagOrmEntity): TagEntity {
    const mappedTag = new TagEntity(tag.id, tag.title);

    return mappedTag;
  }
}
