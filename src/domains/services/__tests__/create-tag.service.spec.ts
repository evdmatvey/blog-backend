import { CreateTagCommand } from '@/domains/ports/in';
import { TagRepositoryPort } from '@/domains/ports/out';
import { CreateTagService } from '../create-tag.service';

describe('CreateTagService', () => {
  let tagRepositoryPort: TagRepositoryPort;
  let createTagService: CreateTagService;
  let tagTitle: string;

  beforeEach(() => {
    tagRepositoryPort = {
      loadTag: jest.fn(),
      create: jest.fn(),
      loadTags: jest.fn(),
    };
    createTagService = new CreateTagService(tagRepositoryPort);
  });

  afterEach(() => {
    tagTitle = null;
    createTagService = null;
  });

  it('should create tag', async () => {
    tagTitle = 'title';

    const command: CreateTagCommand = new CreateTagCommand(tagTitle);
    await createTagService.createTag(command);

    expect(tagRepositoryPort.create).toHaveBeenCalledWith({
      title: '#' + tagTitle,
    });
  });

  it('should create tag again', async () => {
    tagTitle = '##title';

    const command: CreateTagCommand = new CreateTagCommand(tagTitle);
    await createTagService.createTag(command);

    expect(tagRepositoryPort.create).toHaveBeenCalledWith({
      title: '#' + 'title',
    });
  });

  it('should throw title length error', async () => {
    tagTitle = 'a';

    const command: CreateTagCommand = new CreateTagCommand(tagTitle);

    await expect(() => createTagService.createTag(command)).rejects.toThrow(
      'Длина нового тега должна быть больше 1 симбола!',
    );
  });

  it('should throw title length error again', async () => {
    tagTitle = 'a ';

    const command: CreateTagCommand = new CreateTagCommand(tagTitle);

    await expect(() => createTagService.createTag(command)).rejects.toThrow(
      'Длина нового тега должна быть больше 1 симбола!',
    );
  });
});
