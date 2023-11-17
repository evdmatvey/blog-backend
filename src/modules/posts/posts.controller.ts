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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { RoleGuard } from '@/modules/auth/guards/role.guard';
import { Roles } from '@/decorators/role.decorator';
import { UserId } from '@/decorators/user-id.decorator';
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
  CreatePostResponse,
  DeletingMessage,
  PostResponse,
} from './types';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    @Inject(CreatePostUseCaseSymbol)
    private readonly _createPostUseCase: CreatePostUseCase,
    private readonly _postsRepository: PostsRepository,
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

  @Get('/approved')
  @ApiOkResponse({ type: ApprovedPostResponse, isArray: true })
  getAllApproved() {
    return this._postsRepository.getAllByStatus('approved');
  }

  @Get('/approved/:id')
  @ApiOkResponse({ type: ApprovedPostResponse })
  async getOneApproved(@Query('id') id: string) {
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
  async getOneForPreview(@Query('id') id: string) {
    const post = await this._postsRepository.getOneByStatus(id, 'preview');
    if (!post) throw new NotFoundException('Статья не найдена');

    return post;
  }

  @Get(':id')
  @ApiOkResponse({ type: PostResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  getOne(@Query('id') id: string) {
    return this._postsRepository.getOne(id);
  }

  @Patch('/approve/:id')
  @ApiOkResponse({ type: ApprovingMessage })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  async approvePost(@Query('id') id: string) {
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
  async deletePost(@Query('id') id: string) {
    const post = await this._postsRepository.delete(id);

    return {
      msg: `Вы успешно удалили статью! Название: ${post.title.slice(0, 10)}...`,
    };
  }
}
