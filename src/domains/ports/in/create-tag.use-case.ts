import { TagEntity } from '@/domains/entities/tag.entity';
import { CreateTagCommand } from './create-tag.command';

export const CreateTagUseCaseSymbol = Symbol('CreateTagUseCaseSymbol');

export interface CreateTagUseCase {
  createTag(command: CreateTagCommand): Promise<TagEntity>;
}
