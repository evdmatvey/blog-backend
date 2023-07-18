import { TagEntity } from '@/domains/entities';

interface TagData {
  _id: string;
  title: string;
}

export class TagMapper {
  static mapToDomain(tag: TagData): TagEntity {
    const mappedTag = new TagEntity(tag._id, tag.title);

    return mappedTag;
  }
}
