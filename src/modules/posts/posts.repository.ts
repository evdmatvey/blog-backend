import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostEntity, PostStatus } from '@/domains/entities';
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
    const post = await this._repository.create({
      ...dto,
      author: dto.authorId,
    });

    return post;
  }

  async getOne(id: string) {
    const post = await this._repository
      .findById(id)
      .populate('author', 'nickname avatar')
      .populate('tags', '_id title');

    return PostMapper.mapToDomain(post).getPostData();
  }

  async getAll() {
    const posts = await this._repository
      .find()
      .populate('author', 'nickname avatar')
      .populate('tags', '_id title');

    return posts;
  }

  async getAllByStatus(status: PostStatus) {
    const posts = await this._repository
      .find({ status })
      .populate('author', 'nickname avatar')
      .populate('tags', '_id title');

    return posts;
  }

  async getOneByStatus(_id: string, status: PostStatus) {
    const post = await this._repository
      .findOne({ _id, status })
      .populate('author', 'nickname avatar')
      .populate('tags', '_id title');

    return post;
  }

  async approvePostById(id: string) {
    const post = await this._repository.findById(id);
    post.status = 'approved';
    await post.save();

    return post;
  }

  async delete(_id: string) {
    const post = await this._repository.findById(_id);
    await this._repository.deleteOne({ _id });

    return post;
  }
}
