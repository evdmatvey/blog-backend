import { TagRepositoryPort } from '@/domains/ports/out';
import { SearchTagService } from '../search-tag.service';
import { SearchTagCommand } from '@/domains/ports/in';
import { TagEntity } from '@/domains/entities';

describe('SearchTagService', () => {
  let tagRepositoryPort: TagRepositoryPort;
  let searchTagService: SearchTagService;
  let search: string;

  const loadedTags = [
    new TagEntity('one', '#nest.js'),
    new TagEntity('two', '#react.js'),
    new TagEntity('three', '#node.js'),
  ];

  beforeEach(() => {
    tagRepositoryPort = {
      loadTag: jest.fn(),
      create: jest.fn(),
      loadTags: jest.fn(),
      update: jest.fn(),
    };

    searchTagService = new SearchTagService(tagRepositoryPort);
  });

  afterEach(() => {
    searchTagService = null;
    search = null;
  });

  it('should get one result', async () => {
    search = 'nest.js';
    const command: SearchTagCommand = new SearchTagCommand(search);
    (tagRepositoryPort.loadTags as jest.Mock).mockResolvedValue(loadedTags);

    const result = await searchTagService.search(command);

    expect(result.length).toBe(1);
    expect(result[0]._id).toBe('one');
  });

  it('should get one result again', async () => {
    search = 'nes';
    const command: SearchTagCommand = new SearchTagCommand(search);
    (tagRepositoryPort.loadTags as jest.Mock).mockResolvedValue(loadedTags);

    const result = await searchTagService.search(command);

    expect(result.length).toBe(1);
    expect(result[0]._id).toBe('one');
  });

  it('should get several results', async () => {
    search = 't.';
    const command: SearchTagCommand = new SearchTagCommand(search);
    (tagRepositoryPort.loadTags as jest.Mock).mockResolvedValue(loadedTags);

    const result = await searchTagService.search(command);

    expect(result.length).toBe(2);
    expect(result[0]._id).toBe('one');
    expect(result[1]._id).toBe('two');
  });

  it('should not get result', async () => {
    search = '0';
    const command: SearchTagCommand = new SearchTagCommand(search);
    (tagRepositoryPort.loadTags as jest.Mock).mockResolvedValue(loadedTags);

    const result = await searchTagService.search(command);

    expect(result.length).toBe(0);
  });
});
