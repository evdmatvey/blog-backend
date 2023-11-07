import { TagRepositoryPort } from '@/domains/ports/out';
import { UpdateTagService } from '../update-tag.service';
import { UpdateTagCommand } from '@/domains/ports/in';

describe('UpdateTagService', () => {
  let tagRepositoryPort: TagRepositoryPort;
  let updateTagService: UpdateTagService;
  let tagTitle: string;

  const tagId: string = 'some-id';

  beforeEach(() => {
    tagRepositoryPort = {
      loadTag: jest.fn(),
      create: jest.fn(),
      loadTags: jest.fn(),
      update: jest.fn(),
    };
    updateTagService = new UpdateTagService(tagRepositoryPort);
  });

  afterEach(() => {
    tagTitle = null;
    updateTagService = null;
  });

  it('should update tag', async () => {
    tagTitle = 'newTitleOfTag';

    const command: UpdateTagCommand = new UpdateTagCommand(tagId, tagTitle);
    await updateTagService.updateTag(command);

    expect(tagRepositoryPort.update).toHaveBeenCalledWith(
      tagId,
      '#' + tagTitle,
    );
  });

  it('should update tag again', async () => {
    tagTitle = 'newTitleOfTag';

    const command: UpdateTagCommand = new UpdateTagCommand(
      tagId,
      '#' + tagTitle,
    );
    await updateTagService.updateTag(command);

    expect(tagRepositoryPort.update).toHaveBeenCalledWith(
      tagId,
      '#' + tagTitle,
    );
  });

  it('should throw title length error', async () => {
    tagTitle = 't';

    const command: UpdateTagCommand = new UpdateTagCommand(tagId, tagTitle);

    await expect(() => updateTagService.updateTag(command)).rejects.toThrow(
      'Длина тега должна быть больше 1 симбола!',
    );
  });

  it('should throw require title error', async () => {
    tagTitle = '';

    const command: UpdateTagCommand = new UpdateTagCommand(tagId, tagTitle);

    await expect(() => updateTagService.updateTag(command)).rejects.toThrow(
      'Укажите название тега!',
    );
  });
});
