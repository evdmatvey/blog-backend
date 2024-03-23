import mongoose, { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Message } from '@/utils/types/Message';
import { PostEntity, PostStatus, TagData } from '@/domains/entities';
import { PostRepositoryPort } from '@/domains/ports/out';
import { Post, postDocument } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostMapper } from './post.mapper';
import { GetPostsVariant, GetPostsResponse } from './types';

type CreatePostData = { authorId: string } & CreatePostDto;

export interface TagMapData {
  tag: ObjectId;
  count: number;
}

export interface AuthorMapData {
  author: ObjectId;
  count: number;
}

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

  async getPosts(
    variant: GetPostsVariant,
    page: number,
    limit: number,
    tagId: string,
    authorId: string,
  ): Promise<GetPostsResponse> {
    let posts: postDocument[];

    switch (variant) {
      case 'basic':
        posts = await this.getAllByStatus('approved');
        break;
      case 'popular':
        posts = await this._getPopular();
        break;
      case 'new':
        posts = await this._getNew();
        break;
      case 'filter':
        posts = await this._getPostsByFilters(tagId, authorId);
        break;
    }

    const pages = Math.ceil(posts.length / limit);
    posts = posts.slice(limit * (page - 1), limit * page);

    return { posts, pages, currentPage: page, limit };
  }

  async getOneByStatus(_id: string, status: PostStatus) {
    const post = await this._repository
      .findOne({ _id, status })
      .populate('author', 'nickname avatar')
      .populate('tags', '_id title');

    return post;
  }

  async search(title: string) {
    const posts = await this.getAllByStatus('approved');

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(title) ||
        post.desc.toLowerCase().includes(title) ||
        post.tags.filter((tag) =>
          //@ts-ignore
          tag.title.toLowerCase().includes(title),
        ).length !== 0,
    );
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

  async likePost(id: string, condition: boolean): Promise<Message> {
    const post = await this._repository.findById(id);

    if (condition) {
      post.likes += 1;
      await post.save();

      return { msg: 'Вы добавиили статью в понравившиеся!' };
    } else {
      post.likes -= 1;
      await post.save();

      return { msg: 'Вы удалили статью из понравившихся!' };
    }
  }

  async getPopularTags() {
    const posts = await this.getAllByStatus('approved');
    const map = new Map<string, TagMapData>();

    posts.forEach((post) =>
      post.tags.forEach((tag) => {
        //@ts-ignore
        const tagId = tag._id;
        if (map.has(tagId)) {
          map.get(tagId).count += 1;
        } else {
          map.set(tagId, { tag, count: 1 });
        }
      }),
    );

    const tags = Array.from(map, ([_, value]) => value)
      .sort((a, b) => b.count - a.count)
      .map((tag) => tag.tag)
      .slice(0, 5);

    return tags;
  }

  async getPopularAuthors() {
    const posts = await this.getAllByStatus('approved');
    const map = new Map<string, AuthorMapData>();

    posts.forEach((post) => {
      //@ts-ignore
      const authorId = post.author._id;
      if (map.has(authorId)) {
        map.get(authorId).count += 1;
      } else {
        map.set(authorId, { author: post.author, count: 1 });
      }
    });

    const authors = Array.from(map, ([_, value]) => value)
      .sort((a, b) => b.count - a.count)
      .map((author) => author.author)
      .slice(0, 5);

    return authors;
  }

  private async _getPostsByFilters(tagId: string, authorId: string) {
    const isTagIdExist = mongoose.Types.ObjectId.isValid(tagId);
    const isAuthorIdExist = mongoose.Types.ObjectId.isValid(authorId);

    if (isTagIdExist && isAuthorIdExist) {
      const posts = await this._repository
        .find({ tags: { $in: [tagId] }, author: authorId })
        .populate('author', 'nickname avatar')
        .populate('tags');

      return posts;
    }

    if (isTagIdExist && !isAuthorIdExist) {
      const posts = await this._repository
        .find({ tags: { $in: [tagId] } })
        .populate('author', 'nickname avatar')
        .populate('tags');

      return posts;
    }

    if (isAuthorIdExist && !isTagIdExist) {
      const posts = await this._repository
        .find({ author: authorId })
        .populate('author', 'nickname avatar')
        .populate('tags');

      return posts;
    }

    return this.getAllByStatus('approved');
  }

  private async _getNew() {
    const posts = await this._repository
      .find({ status: 'approved' })
      .populate('author', 'nickname avatar')
      .populate('tags');

    return posts.reverse();
  }

  private async _getPopular() {
    const posts = await this._repository
      .find({ status: 'approved' })
      .populate('author', 'nickname avatar')
      .populate('tags');

    return posts.sort((a, b) => b.likes - a.likes);
  }
}
