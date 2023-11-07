import { TagEntity } from '@/domains/entities';
import { UpdateTagCommand, UpdateTagUseCase } from '@/domains/ports/in';
import { TagRepositoryPort } from '@/domains/ports/out';
import { Validation } from '@/utils/validation';

export class UpdateTagService implements UpdateTagUseCase {
  constructor(private readonly _tagRepository: TagRepositoryPort) {}

  async updateTag(command: UpdateTagCommand): Promise<TagEntity> {
    const titleValidation = new Validation<typeof command>(command);
    titleValidation.validate('title', {
      required: 'Укажите название тега!',
      length: {
        min: 2,
        errorMessage: 'Длина тега должна быть больше 1 симбола!',
      },
    });

    const updatedTag = await this._tagRepository.update(
      command.id,
      titleValidation.addPrefix('title', {
        regExp: /#/g,
        value: '#',
      }),
    );

    return updatedTag;
  }
}
