import { TagEntity } from '@/domains/entities';
import { CreateTagCommand } from '@/domains/ports/in';
import { TagRepositoryPort } from '@/domains/ports/out';
import { CreateTagService } from '../create-tag.service';

describe('CreateTagService', () => {
  let tagRepositoryPort: TagRepositoryPort;
  let createTagService: CreateTagService;
  let tagId: string;
  let tagTitle: string;

  beforeEach(() => {
    tagRepositoryPort = {
      loadTag: jest.fn(),
      create: jest.fn(),
    };
    createTagService = new CreateTagService(tagRepositoryPort);
    tagId = 'test-id';
  });

  afterEach(() => {
    tagId = null;
    tagTitle = null;
    createTagService = null;
  });

  it('should create tag', async () => {
    tagTitle = 'title';

    const command: CreateTagCommand = new CreateTagCommand(tagId, tagTitle);
    await createTagService.createTag(command);

    expect(tagRepositoryPort.create).toHaveBeenCalledWith('#' + tagTitle);
  });

  it('should create tag again', async () => {
    tagTitle = '##title';

    const command: CreateTagCommand = new CreateTagCommand(tagId, tagTitle);
    await createTagService.createTag(command);

    expect(tagRepositoryPort.create).toHaveBeenCalledWith(
      '#' + tagTitle.replace(/#/g, ''),
    );
  });

  it('should throw title length error', async () => {
    tagTitle = 'a';

    const command: CreateTagCommand = new CreateTagCommand(tagId, tagTitle);

    await expect(() => createTagService.createTag(command)).rejects.toThrow(
      'Длина названия тега должна быть больше 1',
    );
  });

  it('should throw title length error again', async () => {
    tagTitle = 'a ';

    const command: CreateTagCommand = new CreateTagCommand(tagId, tagTitle);

    await expect(() => createTagService.createTag(command)).rejects.toThrow(
      'Длина названия тега должна быть больше 1',
    );
  });
});
