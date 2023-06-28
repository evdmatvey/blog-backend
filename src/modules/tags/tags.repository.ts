import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagRepositoryPort } from '@/domains/ports/out';
import { InjectRepository } from '@nestjs/typeorm';
import { TagOrmEntity } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { TagEntity } from '@/domains/entities';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TagsRepository implements TagRepositoryPort {
  constructor(
    @InjectRepository(TagOrmEntity)
    private readonly _repository: Repository<TagOrmEntity>,
  ) {}

  async loadTag(id: string): Promise<TagEntity> {
    const tag = await this._repository.findOneBy({ id });
    return TagMapper.mapToDomain(tag);
  }

  async loadTags(): Promise<TagOrmEntity[]> {
    const tags = await this._repository.find();
    return tags;
  }

  create(dto: CreateTagDto) {
    return this._repository.save(dto);
  }
}
