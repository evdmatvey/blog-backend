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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    @Inject(CreatePostUseCaseSymbol)
    private readonly _createPostUseCase: CreatePostUseCase,
    private readonly _postsRepository: PostsRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  getAll() {
    return this._postsRepository.getAll();
  }

  @Get('/approved')
  getAllApproved() {
    return this._postsRepository.getAllByStatus('approved');
  }

  @Get('/approved/:id')
  async getOneApproved(@Query('id') id: string) {
    const post = await this._postsRepository.getOneByStatus(id, 'approved');
    if (!post) throw new NotFoundException('Статья не найдена');

    return post;
  }

  @Get('/preview')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  getAllForPreview() {
    return this._postsRepository.getAllByStatus('preview');
  }

  @Get('/preview/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  @ApiBearerAuth()
  async getOneForPreview(@Query('id') id: string) {
    const post = await this._postsRepository.getOneByStatus(id, 'preview');
    if (!post) throw new NotFoundException('Статья не найдена');

    return post;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  getOne(@Query('id') id: string) {
    return this._postsRepository.getOne(id);
  }

  @Patch('/approve/:id')
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
