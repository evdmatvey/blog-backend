import { TagEntity } from '@/domains/entities';
import { CreateTagCommand, CreateTagUseCase } from '@/domains/ports/in';
import { TagRepositoryPort } from '@/domains/ports/out';
import { Validation } from '@/utils/validation';

export class CreateTagService implements CreateTagUseCase {
  constructor(private readonly _tagRepository: TagRepositoryPort) {}

  async createTag(command: CreateTagCommand): Promise<TagEntity> {
    const titleValidation = new Validation<typeof command>(command);
    titleValidation.validate('title', {
      required: 'Укажите название нового тега!',
      length: {
        min: 2,
        errorMessage: 'Длина нового тега должна быть больше 1 симбола!',
      },
    });

    const createdTag = await this._tagRepository.create({
      title: titleValidation.addPrefix('title', {
        regExp: /#/g,
        value: '#',
      }),
    });

    return createdTag;
  }
}
