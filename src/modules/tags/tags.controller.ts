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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
  UpdateUserCommand,
} from '@/domains/ports/in';
import { Roles } from '@/decorators/role.decorator';
import { RoleEntity } from '@/domains/entities';
import { RoleGuard } from '../auth/guards/role.guard';
import { TagsRepository } from './tags.repository';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

interface Message {
  msg: string;
}

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tags')
@ApiTags('Tags')
@ApiBearerAuth()
export class TagsController {
  constructor(
    @Inject(CreateTagUseCaseSymbol)
    private readonly _createTagUseCase: CreateTagUseCase,
    @Inject(SearchTagUseCaseSymbol)
    private readonly _searchTagUseCase: SearchTagUseCase,
    @Inject(UpdateTagUseCaseSymbol)
    private readonly _updateTagUseCase: UpdateTagUseCase,
    private readonly _tagRepository: TagsRepository,
  ) {}

  @Post()
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  async create(@Body() createTagDto: CreateTagDto) {
    const command = new CreateTagCommand(createTagDto.title);
    const createdTag = await this._createTagUseCase.createTag(command);
    return createdTag;
  }

  @Get()
  findAll() {
    return this._tagRepository.getAll();
  }

  @Get('/search')
  async search(@Query('title') title: string) {
    const command = new SearchTagCommand(title);
    const tags = await this._searchTagUseCase.search(command);
    return tags;
  }

  @Roles([RoleEntity.ADMIN])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tag = await this._tagRepository.getOne(id);

    if (!tag) throw new ForbiddenException('Произошла ошибка. Тег не найден');

    return tag;
  }

  @Roles([RoleEntity.ADMIN])
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Message> {
    try {
      const tag = (await this._tagRepository.loadTag(id)).getTagData();
      await this._tagRepository.delete(id);

      return { msg: `Вы успешно удалили тег: ${tag.title}` };
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Ошибка при удалении тега');
    }
  }

  @Roles([RoleEntity.ADMIN])
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    try {
      const command = new UpdateTagCommand(id, dto.title);
      return (await this._updateTagUseCase.updateTag(command)).getTagData();
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
