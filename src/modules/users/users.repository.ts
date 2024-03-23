import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { postDocument } from '@/modules/posts/entities/post.entity';
import { GetPostsByUserVariant } from '@/modules/posts/types';
import { UserEntity } from '@/domains/entities';
import { UserRepositoryPort } from '@/domains/ports/out';
import { CreateUserDto } from './dto/create-user.dto';
import { User, userDocument } from './entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(User.name)
    private readonly _repository: Model<userDocument>,
  ) {}

  async findByEmail(email: string) {
    return this._repository.findOne({ email });
  }

  async findById(id: string) {
    return this._repository.findById(id);
  }

  async loadUser(id: string): Promise<UserEntity> {
    const user = await this._repository.findById(id);
    return UserMapper.mapToDomain(user);
  }

  async create(dto: CreateUserDto) {
    return this._repository.create({ ...dto, nickname: '@' + dto.nickname });
  }

  async getAll() {
    return this._repository.find();
  }

  async getPostsByUser(
    id: string,
    variant: GetPostsByUserVariant,
    page: number,
    limit: number,
  ) {
    let posts;

    switch (variant) {
      case 'bookmarks':
        posts = await this._getBookmarkPosts(id);
        break;
      case 'liked':
        posts = await this._getLikedPosts(id);
        break;
    }

    const pages = Math.ceil(posts.length / limit);
    posts = posts.reverse().slice(limit * (page - 1), limit * page);

    return { posts, pages, currentPage: page, limit };
  }

  async updateUser(user: UserEntity) {
    try {
      const updatedUser = user.getUserData();
      const currentUser = await this._repository.findById(updatedUser._id);

      currentUser.email = updatedUser.email;
      currentUser.password = updatedUser.password;
      currentUser.desc = updatedUser.desc;
      currentUser.avatar = updatedUser.avatar;

      await currentUser.save();

      return updatedUser;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async likePost(userId: string, postId: string): Promise<boolean> {
    const user = await this._repository.findById(userId);
    const condition =
      user.likedPosts.filter((id) => (id.valueOf() as string) === postId)
        .length === 0
        ? true
        : false;

    if (condition) {
      //@ts-ignore
      user.likedPosts.push(postId);

      await user.save();
    } else {
      user.likedPosts = user.likedPosts.filter(
        (id) => (id.valueOf() as string) !== postId,
      );

      await user.save();
    }

    return condition;
  }

  async bookmarkPost(userId: string, postId: string) {
    const user = await this._repository.findById(userId);
    const condition =
      user.bookmarks.filter((id) => (id.valueOf() as string) === postId)
        .length === 0
        ? true
        : false;

    if (condition) {
      //@ts-ignore
      user.bookmarks.push(postId);

      await user.save();

      return { msg: 'Вы добавили статью в закладки!' };
    } else {
      user.bookmarks = user.bookmarks.filter(
        (id) => (id.valueOf() as string) !== postId,
      );

      await user.save();
      return { msg: 'Вы удалили статью из закладок!' };
    }
  }

  private async _getLikedPosts(id: string) {
    const user = await this._repository.findById(id).populate({
      path: 'likedPosts',
      populate: [
        {
          path: 'author',
          select: 'nickname avatar',
        },
        {
          path: 'tags',
        },
      ],
    });

    return user.likedPosts;
  }

  private async _getBookmarkPosts(id: string) {
    const user = await this._repository.findById(id).populate({
      path: 'bookmarks',
      populate: [
        {
          path: 'author',
          select: 'nickname avatar',
        },
        {
          path: 'tags',
        },
      ],
    });

    return user.bookmarks;
  }
}
