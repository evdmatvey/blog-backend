import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Inject,
  UseGuards,
  Query,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Message } from '@/utils/types/Message';
import {
  CreateTagCommand,
  CreateTagUseCase,
  CreateTagUseCaseSymbol,
  SearchTagCommand,
  SearchTagUseCase,
  SearchTagUseCaseSymbol,
  UpdateTagCommand,
  UpdateTagUseCase,
  UpdateTagUseCaseSymbol,
} from '@/domains/ports/in';
import { Roles } from '@/decorators/role.decorator';
import { RoleEntity } from '@/domains/entities';
import { RoleGuard } from '../auth/guards/role.guard';
import { TagsRepository } from './tags.repository';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DeleteTagResponse, TagResponse } from './types';
import { PostsRepository } from '../posts/posts.repository';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(
    @Inject(CreateTagUseCaseSymbol)
    private readonly _createTagUseCase: CreateTagUseCase,
    @Inject(SearchTagUseCaseSymbol)
    private readonly _searchTagUseCase: SearchTagUseCase,
    @Inject(UpdateTagUseCaseSymbol)
    private readonly _updateTagUseCase: UpdateTagUseCase,
    private readonly _tagRepository: TagsRepository,
    private readonly _postsRepository: PostsRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagResponse })
  async create(@Body() createTagDto: CreateTagDto) {
    const command = new CreateTagCommand(createTagDto.title);
    const createdTag = await this._createTagUseCase.createTag(command);
    return createdTag;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagResponse, isArray: true })
  findAll() {
    return this._tagRepository.getAll();
  }

  @Get('/popular')
  @ApiOkResponse({ type: TagResponse, isArray: true })
  getPopular() {
    return this._postsRepository.getPopularTags();
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagResponse, isArray: true })
  async search(@Query('title') title: string) {
    const command = new SearchTagCommand(title);
    const tags = await this._searchTagUseCase.search(command);
    return tags;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagResponse })
  async findOne(@Param('id') id: string) {
    const tag = await this._tagRepository.getOne(id);

    if (!tag) throw new ForbiddenException('Произошла ошибка. Тег не найден');

    return tag;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeleteTagResponse })
  async delete(@Param('id') id: string): Promise<Message> {
    try {
      const tag = (await this._tagRepository.loadTag(id)).getTagData();
      await this._tagRepository.delete(id);

      return { msg: `Вы успешно удалили тег: ${tag.title}` };
    } catch (error) {
      throw new ForbiddenException('Ошибка при удалении тега');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([RoleEntity.ADMIN])
  @ApiBearerAuth()
  @ApiOkResponse({ type: TagResponse })
  async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    try {
      const command = new UpdateTagCommand(id, dto.title);
      const tag = await this._updateTagUseCase.updateTag(command);
      return tag.getTagData();
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
