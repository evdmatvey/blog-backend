import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UserOrmEntity } from './entities/user.entity';
import { UpdateUserUseCaseSymbol } from '@/domains/ports/in';
import { UpdateUserService } from '@/domains/services';
import { UserRepositoryPort } from '@/domains/ports/out/user-repository.port';

@Module({
  controllers: [UsersController],
  providers: [
    UsersRepository,
    {
      provide: UpdateUserUseCaseSymbol,
      useClass: UpdateUserService,
    },
    {
      provide: UpdateUserUseCaseSymbol,
      useFactory: (_userRepository: UserRepositoryPort) => {
        return new UpdateUserService(_userRepository);
      },
      inject: [UsersRepository],
    },
  ],

  exports: [UsersRepository, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
})
export class UsersModule {}
