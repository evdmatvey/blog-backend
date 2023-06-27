import { CreateTagCommand, CreateTagUseCase } from '../ports/in';
import { TagEntity } from '@/domains/entities';
import { TagRepositoryPort } from '@/domains/ports/out';

export class CreateTagService implements CreateTagUseCase {
  constructor(private readonly _tagRepository: TagRepositoryPort) {}

  async createTag(command: CreateTagCommand): Promise<TagEntity> {
    const tag = new TagEntity(command.id, command.title);
    tag.create();
    const createdTag = await this._tagRepository.create(tag.getTagData().title);

    return createdTag;
  }
}
