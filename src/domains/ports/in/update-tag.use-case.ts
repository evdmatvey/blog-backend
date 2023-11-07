import { TagEntity } from '@/domains/entities/tag.entity';
import { UpdateTagCommand } from './update-tag.command';

export const UpdateTagUseCaseSymbol = Symbol('UpdateTagUseCaseSymbol');

export interface UpdateTagUseCase {
  updateTag(command: UpdateTagCommand): Promise<TagEntity>;
}
