import {
  Controller,
  Post,
  Body,
  UseGuards,
  Inject,
  Get,
  Query,
  ForbiddenException,
  NotFoundException,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { RoleGuard } from '@/modules/auth/guards/role.guard';
import { UsersRepository } from '@/modules/users/users.repository';
import { Roles } from '@/decorators/role.decorator';
import { UserId } from '@/decorators/user-id.decorator';
import { Message } from '@/utils/types/Message';
import { RoleEntity } from '@/domains/entities';
import {
  CreatePostCommand,
  CreatePostUseCase,
  CreatePostUseCaseSymbol,
} from '@/domains/ports/in';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import {
  ApprovedPostResponse,
  ApprovingMessage,
  BookmarkPostResponse,
  CreatePostResponse,
  DeletingMessage,
  GetPostsByUserVariant,
  GetPostsVariant,
  LikePostResponse,
  PostResponse,
} from './types';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    @Inject(CreatePostUseCaseSymbol)
    private readonly _createPostUseCase: CreatePostUseCase,
    private readonly _postsRepository: PostsRepository,
    private readonly _usersRepository: UsersRepository,
  ) {}

  @Post()
  @ApiOkResponse({ type: CreatePostResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  async create(@UserId() userId: string, @Body() dto: CreatePostDto) {
    try {
      const { desc, image, tags, text, title } = dto;

      const command = new CreatePostCommand(
        userId,
        title,
        desc,
        image,
        tags,
        text,
        'preview',
      );
      const post = await this._createPostUseCase.createPost(command);

      return post;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Get()
  @ApiOkResponse({ type: PostResponse, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  getAll() {
    return this._postsRepository.getAll();
  }

  @Get('/search/?')
  @ApiOkResponse({ type: ApprovedPostResponse, isArray: true })
  async search(@Query('title') title: string) {
    return this._postsRepository.search(title.toLowerCase());
  }

  @Get('/approved/?')
  @ApiOkResponse({ type: ApprovedPostResponse, isArray: true })
  getAllApproved(
    @Query('variant') variant: GetPostsVariant,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('tagId') tagId: string,
    @Query('authorId') authorId: string,
  ) {
    return this._postsRepository.getPosts(
      variant,
      page,
      limit,
      tagId,
      authorId,
    );
  }

  @Get('/by-user/?')
  @ApiOkResponse({ type: ApprovedPostResponse, isArray: true })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getByUser(
    @UserId() id: string,
    @Query('variant') variant: GetPostsByUserVariant,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this._usersRepository.getPostsByUser(id, variant, page, limit);
  }

  @Get('/approved/:id')
  @ApiOkResponse({ type: ApprovedPostResponse })
  async getOneApproved(@Param('id') id: string) {
    const post = await this._postsRepository.getOneByStatus(id, 'approved');
    if (!post) throw new NotFoundException('Статья не найдена');

    return post;
  }

  @Get('/preview')
  @ApiOkResponse({ type: PostResponse, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  getAllForPreview() {
    return this._postsRepository.getAllByStatus('preview');
  }

  @Get('/preview/:id')
  @ApiOkResponse({ type: PostResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  async getOneForPreview(@Param('id') id: string) {
    const post = await this._postsRepository.getOneByStatus(id, 'preview');
    if (!post) throw new NotFoundException('Статья не найдена');

    return post;
  }

  @Get(':id')
  @ApiOkResponse({ type: PostResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  getOne(@Param('id') id: string) {
    return this._postsRepository.getOne(id);
  }

  @Patch('/approve/:id')
  @ApiOkResponse({ type: ApprovingMessage })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  async approvePost(@Param('id') id: string): Promise<Message> {
    const post = await this._postsRepository.approvePostById(id);

    return {
      msg: `Вы успешно одобрили статью! Название: ${post.title.slice(
        0,
        10,
      )}...`,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeletingMessage })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  async deletePost(@Param('id') id: string): Promise<Message> {
    const post = await this._postsRepository.delete(id);

    return {
      msg: `Вы успешно удалили статью! Название: ${post.title.slice(0, 10)}...`,
    };
  }

  @Patch('/likePost/:postId')
  @ApiOkResponse({ type: LikePostResponse })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async likePost(
    @UserId() id: string,
    @Param('postId') postId: string,
  ): Promise<Message> {
    const condition: boolean = await this._usersRepository.likePost(id, postId);

    return this._postsRepository.likePost(postId, condition);
  }

  @Patch('/bookmarkPost/:postId')
  @ApiOkResponse({ type: BookmarkPostResponse })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async bookmarkPost(
    @UserId() id: string,
    @Param('postId') postId: string,
  ): Promise<Message> {
    const response: Message = await this._usersRepository.bookmarkPost(
      id,
      postId,
    );

    return response;
  }
}
