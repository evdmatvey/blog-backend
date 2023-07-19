import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagRepositoryPort } from '@/domains/ports/out';
import { TagEntity } from '@/domains/entities';
import { Tag, tagDocument } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TagsRepository implements TagRepositoryPort {
  constructor(
    @InjectModel(Tag.name)
    private readonly _repository: Model<tagDocument>,
  ) {}

  async loadTag(id: string): Promise<TagEntity> {
    const tag = await this._repository.findById(id);
    return TagMapper.mapToDomain(tag);
  }

  async loadTags(): Promise<Tag[]> {
    const tags = await this._repository.find();
    return tags;
  }

  create(dto: CreateTagDto) {
    return this._repository.create(dto);
  }
}
