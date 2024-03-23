import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatePostUseCaseSymbol } from '@/domains/ports/in';
import { CreatePostService } from '@/domains/services';
import { PostRepositoryPort } from '@/domains/ports/out';
import { Post, postSchema } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { User, userSchema } from '../users/entities/user.entity';

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
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
  ],
})
export class PostsModule {}
