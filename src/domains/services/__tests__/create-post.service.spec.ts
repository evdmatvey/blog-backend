import { PostRepositoryPort } from '@/domains/ports/out';
import { CreatePostService } from '../create-post.service';
import { CreatePostCommand } from '@/domains/ports/in';

describe('CreateUserService', () => {
  let postRepositoryPort: PostRepositoryPort;
  let createPostService: CreatePostService;
  let postData = {
    authorId: null,
    title: null,
    desc: null,
    image: null,
    text: null,
    status: null,
    tags: null,
  };

  beforeEach(() => {
    postRepositoryPort = {
      loadPost: jest.fn(),
      create: jest.fn(),
    };
    createPostService = new CreatePostService(postRepositoryPort);

    postData = {
      authorId: 'some-user-id',
      title: 'Title of the post that length is correct',
      desc: 'Desc of the post that length is also correct',
      image: '/uploads/some-picture.webp',
      text: new Array(201).fill('a').join(''),
      status: 'preview',
      tags: [],
    };
  });

  afterEach(() => {
    postData = {
      authorId: null,
      title: null,
      desc: null,
      image: null,
      text: null,
      status: null,
      tags: null,
    };
    createPostService = null;
  });

  it('should create post', async () => {
    const command: CreatePostCommand = new CreatePostCommand(
      postData.authorId,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    (postRepositoryPort.create as jest.Mock).mockResolvedValue({
      postData,
    });

    await createPostService.createPost(command);

    expect(postRepositoryPort.create).toHaveBeenCalledWith(postData);
  });

  it('should throw title length error', async () => {
    postData.title = 'Title';
    const command: CreatePostCommand = new CreatePostCommand(
      postData.authorId,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    await expect(() => createPostService.createPost(command)).rejects.toThrow(
      'Длина названия новой статьи должна быть больше 10 симболов!',
    );
  });

  it('should throw desc length error', async () => {
    postData.desc = 'Desc';
    const command: CreatePostCommand = new CreatePostCommand(
      postData.authorId,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    await expect(() => createPostService.createPost(command)).rejects.toThrow(
      'Длина описания новой статьи должна быть больше 30 симболов!',
    );
  });

  it('should throw text length error', async () => {
    postData.text = 'Text';
    const command: CreatePostCommand = new CreatePostCommand(
      postData.authorId,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    await expect(() => createPostService.createPost(command)).rejects.toThrow(
      'Длина текста новой статьи должна быть больше 200 симболов!',
    );
  });
});
