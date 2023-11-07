import {
  Controller,
  Post,
  Body,
  UseGuards,
  Inject,
  Get,
  Query,
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

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('posts')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostsController {
  constructor(
    @Inject(CreatePostUseCaseSymbol)
    private readonly _createPostUseCase: CreatePostUseCase,
    private readonly _postsRepository: PostsRepository,
  ) {}

  @Post()
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  create(@UserId() userId: string, @Body() dto: CreatePostDto) {
    const { desc, image, tags, text, title } = dto;
    console.log(userId);

    const command = new CreatePostCommand(
      userId,
      title,
      desc,
      image,
      tags,
      text,
      'preview',
    );

    return this._createPostUseCase.createPost(command);
  }

  @Get(':id')
  getOne(@Query('id') id: string) {
    return this._postsRepository.getOne(id);
  }
}
