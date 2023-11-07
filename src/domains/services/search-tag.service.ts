import { TagData } from '@/domains/entities';
import { TagRepositoryPort } from '@/domains/ports/out';
import { SearchTagCommand, SearchTagUseCase } from '@/domains/ports/in';

export class SearchTagService implements SearchTagUseCase {
  constructor(private readonly _tagRepository: TagRepositoryPort) {}

  async search(command: SearchTagCommand): Promise<TagData[]> {
    const tags = await this._tagRepository.loadTags();
    const filteredTags = tags.filter((tag) => tag.isSought(command.search));

    return filteredTags.map((tag) => tag.getTagData());
  }
}
