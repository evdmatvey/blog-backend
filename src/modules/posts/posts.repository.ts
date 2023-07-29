import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostEntity } from '@/domains/entities';
import { PostRepositoryPort } from '@/domains/ports/out';
import { Post, postDocument } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostMapper } from './post.mapper';

type CreatePostData = { authorId: string } & CreatePostDto;

@Injectable()
export class PostsRepository implements PostRepositoryPort {
  constructor(
    @InjectModel(Post.name) private readonly _repository: Model<postDocument>,
  ) {}

  async loadPost(id: string): Promise<PostEntity> {
    const post = await this._repository.findById(id);

    return PostMapper.mapToDomain(post);
  }

  async create(dto: CreatePostData) {
    console.log(dto);
    const post = await this._repository.create({
      ...dto,
      author: dto.authorId,
    });

    return post;
  }

  async getOne(id: string) {
    const post = await this._repository
      .findById(id)
      .populate('author', 'nick avatar')
      .populate('tags', '_id title');

    return PostMapper.mapToDomain(post).getPostData();
  }
}
