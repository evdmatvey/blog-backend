import { TagData } from '@/domains/entities';
import { SearchTagCommand } from './search-tag.command';

export const SearchTagUseCaseSymbol = Symbol('SearchTagUseCaseSymbol');

export interface SearchTagUseCase {
  search(command: SearchTagCommand): Promise<TagData[]>;
}
