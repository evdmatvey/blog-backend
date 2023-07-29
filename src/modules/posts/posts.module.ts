import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatePostUseCaseSymbol } from '@/domains/ports/in';
import { CreatePostService } from '@/domains/services';
import { PostRepositoryPort } from '@/domains/ports/out';
import { Post, postSchema } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { PostsController } from './posts.controller';

@Module({
  controllers: [PostsController],
  providers: [
    PostsRepository,
    {
      provide: CreatePostUseCaseSymbol,
      useClass: CreatePostService,
    },
    {
      provide: CreatePostUseCaseSymbol,
      useFactory: (_postRepository: PostRepositoryPort) => {
        return new CreatePostService(_postRepository);
      },
      inject: [PostsRepository],
    },
  ],
  exports: [PostsRepository],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
  ],
})
export class PostsModule {}
