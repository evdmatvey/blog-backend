import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateTagCommand,
  CreateTagUseCase,
  CreateTagUseCaseSymbol,
} from '@/domains/ports/in';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsRepository } from './tags.repository';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(
    @Inject(CreateTagUseCaseSymbol)
    private readonly _createTagUseCase: CreateTagUseCase,
    private readonly _tagRepository: TagsRepository,
  ) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      const command = new CreateTagCommand('mock-id', createTagDto.title);
      const createdTag = await this._createTagUseCase.createTag(command);
      return createdTag;
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании нового тега. Попробуйте изменить название',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  findAll() {
    return this._tagRepository.loadTags();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return (await this._tagRepository.loadTag(id)).getTagData();
  }
}
