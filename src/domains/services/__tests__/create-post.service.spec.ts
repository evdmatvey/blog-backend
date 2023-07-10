import { PostRepositoryPort } from '@/domains/ports/out';
import { CreatePostService } from '../create-post.service';
import { CreatePostCommand } from '@/domains/ports/in';

describe('CreateUserService', () => {
  let postRepositoryPort: PostRepositoryPort;
  let createPostService: CreatePostService;
  let postId: string;
  let text: string;
  let postData = {
    author: null,
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

    postId = 'test-id';
    text =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit.' +
      'Odit cum omnis adipisci ipsam.Natus, tempora vitae dolore fugiat';

    postData = {
      author: 'some-user-id',
      title: 'Title of the post that length is correct',
      desc: 'Desc of the post that length is also correct',
      image: '/uploads/some-picture.webp',
      text,
      status: 'preview',
      tags: [],
    };
  });

  afterEach(() => {
    postData = {
      author: null,
      title: null,
      desc: null,
      image: null,
      text: null,
      status: null,
      tags: null,
    };
    text = null;
    createPostService = null;
  });

  it('should create post', async () => {
    const command: CreatePostCommand = new CreatePostCommand(
      postId,
      postData.author,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    (postRepositoryPort.create as jest.Mock).mockResolvedValue({
      id: postId,
      ...postData,
    });

    const result = await createPostService.createPost(command);

    expect(postRepositoryPort.create).toHaveBeenCalledWith(postData);
    expect(result).toEqual({ id: postId, ...postData });
  });

  it('should throw title length error', async () => {
    postData.title = 'Title';
    const command: CreatePostCommand = new CreatePostCommand(
      postId,
      postData.author,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    await expect(() => createPostService.createPost(command)).rejects.toThrow(
      'Длина названия статьи должна быть больше 10',
    );
  });

  it('should throw desc length error', async () => {
    postData.desc = 'Desc';
    const command: CreatePostCommand = new CreatePostCommand(
      postId,
      postData.author,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    await expect(() => createPostService.createPost(command)).rejects.toThrow(
      'Длина описания статьи должна быть больше 30',
    );
  });

  it('should throw text length error', async () => {
    postData.text = 'Text';
    const command: CreatePostCommand = new CreatePostCommand(
      postId,
      postData.author,
      postData.title,
      postData.desc,
      postData.image,
      postData.tags,
      postData.text,
      postData.status,
    );

    await expect(() => createPostService.createPost(command)).rejects.toThrow(
      'Длина текста статьи должна быть больше 100',
    );
  });
});
