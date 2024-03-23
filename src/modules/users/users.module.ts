import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UpdateUserUseCaseSymbol,
  UpdateUserPasswordUseCaseSymbol,
} from '@/domains/ports/in';
import {
  UpdateUserService,
  UpdateUserPasswordService,
} from '@/domains/services';
import { UserRepositoryPort } from '@/domains/ports/out';
import { PostsModule } from '@/modules/posts/posts.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User, userSchema } from './entities/user.entity';

@Module({
  controllers: [UsersController],
  providers: [
    UsersRepository,
    {
      provide: UpdateUserUseCaseSymbol,
      useClass: UpdateUserService,
    },
    {
      provide: UpdateUserPasswordUseCaseSymbol,
      useClass: UpdateUserPasswordService,
    },
    {
      provide: UpdateUserUseCaseSymbol,
      useFactory: (_userRepository: UserRepositoryPort) => {
        return new UpdateUserService(_userRepository);
      },
      inject: [UsersRepository],
    },
    {
      provide: UpdateUserPasswordUseCaseSymbol,
      useFactory: (_userRepository: UserRepositoryPort) => {
        return new UpdateUserPasswordService(_userRepository);
      },
      inject: [UsersRepository],
    },
  ],
  exports: [UsersRepository],
  imports: [
    forwardRef(() => PostsModule),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
})
export class UsersModule {}
