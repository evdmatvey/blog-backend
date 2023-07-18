import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateTagCommand,
  CreateTagUseCase,
  CreateTagUseCaseSymbol,
} from '@/domains/ports/in';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsRepository } from './tags.repository';
import { Roles } from '@/decorators/role.decorator';
import { RoleEntity } from '@/domains/entities';
import { RoleGuard } from '../auth/guards/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tags')
@ApiTags('Tags')
@ApiBearerAuth()
export class TagsController {
  constructor(
    @Inject(CreateTagUseCaseSymbol)
    private readonly _createTagUseCase: CreateTagUseCase,
    private readonly _tagRepository: TagsRepository,
  ) {}

  @Post()
  @Roles([RoleEntity.AUTHOR, RoleEntity.ADMIN])
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      const command = new CreateTagCommand(createTagDto.title);
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
