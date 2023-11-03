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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateTagCommand,
  CreateTagUseCase,
  CreateTagUseCaseSymbol,
  SearchTagCommand,
  SearchTagUseCase,
  SearchTagUseCaseSymbol,
} from '@/domains/ports/in';
import { Roles } from '@/decorators/role.decorator';
import { RoleEntity } from '@/domains/entities';
import { RoleGuard } from '../auth/guards/role.guard';
import { TagsRepository } from './tags.repository';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTagDto } from './dto/create-tag.dto';

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
    return (await this._tagRepository.loadTag(id)).getTagData();
  }
}
