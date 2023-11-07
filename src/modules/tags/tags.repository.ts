import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async loadTags(): Promise<TagEntity[]> {
    const tags = await this._repository.find();
    return tags.map((tag) => TagMapper.mapToDomain(tag));
  }

  async getOne(id: string): Promise<Tag> {
    const tag = await this._repository.findById(id);
    return tag;
  }

  async getAll(): Promise<Tag[]> {
    const tags = await this._repository.find();
    return tags;
  }

  create(dto: CreateTagDto) {
    return this._repository.create(dto);
  }

  async delete(id: string) {
    await this._repository.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async update(id: string, title: string): Promise<TagEntity> {
    try {
      const currentTag = await this._repository.findById(id);

      currentTag.title = title;

      await currentTag.save();

      return new TagEntity(id, title);
    } catch (error) {
      throw new Error(
        'Ошибка при обновлении тега. Возможно передан недействительный id!',
      );
    }
  }
}
