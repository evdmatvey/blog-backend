import { PostStatus } from '@/domains/entities';
import { ApiProperty } from '@nestjs/swagger';
import { postDocument } from '../entities/post.entity';

export type GetPostsVariant = 'basic' | 'popular' | 'new' | 'filter';
export type GetPostsByUserVariant = 'liked' | 'bookmarks';

export interface GetPostsResponse {
  posts: postDocument[];
  pages: number;
  currentPage: number;
  limit: number;
}

export class LikePostResponse {
  @ApiProperty({ example: 'Вы добавиили статью в понравившиеся!' })
  msg: string;
}

export class UnLikePostResponse {
  @ApiProperty({ example: 'Вы удалили статью из понравившихся!' })
  msg: string;
}

export class BookmarkPostResponse {
  @ApiProperty({ example: 'Вы добавиили статью в закладки!' })
  msg: string;
}

export class UnBookmarkPostResponse {
  @ApiProperty({ example: 'Вы удалили статью из закладок!' })
  msg: string;
}

export class CreatePostResponse {
  @ApiProperty({ example: '64bb496f5d0c6476d977bd92' })
  _id: string;

  @ApiProperty({ example: '64bb496f5d0c6476d977bd92' })
  author: string;

  @ApiProperty({ example: 'Title' })
  title: string;

  @ApiProperty({ example: 'Desc' })
  desc: string;

  @ApiProperty({ example: '/uploads/05db6d4f4d911a24bb.jpg' })
  image: string;

  @ApiProperty({ example: 'Text' })
  text: string;

  @ApiProperty({ example: 'preview' })
  status: PostStatus;

  @ApiProperty({
    example: ['64bb496f5d0c6476d977bd92', '64bb496f5d0c6476d977bd92'],
  })
  tags: string[];

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  updatedAt: string;
}

export class PostResponse {
  @ApiProperty({ example: '64bb496f5d0c6476d977bd92' })
  _id: string;

  @ApiProperty({
    example: {
      _id: '64bb496f5d0c6476d977bd92',
      nickname: '@evd.matvey',
      avatar: '/uploads/99e7b94b8f7473d021.jpg',
    },
  })
  author: {
    _id: string;
    nickname: string;
    avatar: string;
  };
  @ApiProperty({ example: 'Title' })
  title: string;

  @ApiProperty({ example: 'Desc' })
  desc: string;

  @ApiProperty({ example: '/uploads/05db6d4f4d911a24bb.jpg' })
  image: string;

  @ApiProperty({ example: 'Text' })
  text: string;

  @ApiProperty({ example: 'preview' })
  status: PostStatus;

  @ApiProperty({
    example: [
      { _id: '64bb496f5d0c6476d977bd92', title: '#node.js' },
      { _id: '64bb496f5d0c6476d977bd92', title: '#react' },
    ],
  })
  tags: { _id: string; title: string }[];

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  updatedAt: string;
}

export class ApprovedPostResponse {
  @ApiProperty({ example: '64bb496f5d0c6476d977bd92' })
  _id: string;

  @ApiProperty({
    example: {
      _id: '64bb496f5d0c6476d977bd92',
      nickname: '@evd.matvey',
      avatar: '/uploads/99e7b94b8f7473d021.jpg',
    },
  })
  author: {
    _id: string;
    nickname: string;
    avatar: string;
  };
  @ApiProperty({ example: 'Title' })
  title: string;

  @ApiProperty({ example: 'Desc' })
  desc: string;

  @ApiProperty({ example: '/uploads/05db6d4f4d911a24bb.jpg' })
  image: string;

  @ApiProperty({ example: 'Text' })
  text: string;

  @ApiProperty({ example: 'approved' })
  status: 'approved';

  @ApiProperty({
    example: [
      { _id: '64bb496f5d0c6476d977bd92', title: '#node.js' },
      { _id: '64bb496f5d0c6476d977bd92', title: '#react' },
    ],
  })
  tags: { _id: string; title: string }[];

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-11-17T04:37:21.722Z' })
  updatedAt: string;
}

export class ApprovingMessage {
  @ApiProperty({ example: 'Вы успешно одобрили статью! Название:' })
  msg: string;
}

export class DeletingMessage {
  @ApiProperty({ example: 'Вы успешно удалили статью! Название:' })
  msg: string;
}
