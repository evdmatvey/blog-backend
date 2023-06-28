import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTagUseCaseSymbol } from '@/domains/ports/in';
import { CreateTagService } from '@/domains/services/create-tag.service';
import { TagRepositoryPort } from '@/domains/ports/out';
import { TagOrmEntity } from './entities/tag.entity';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';

@Module({
  controllers: [TagsController],
  providers: [
    TagsRepository,
    {
      provide: CreateTagUseCaseSymbol,
      useClass: CreateTagService,
    },
    {
      provide: CreateTagUseCaseSymbol,
      useFactory: (_tagRepository: TagRepositoryPort) => {
        return new CreateTagService(_tagRepository);
      },
      inject: [TagsRepository],
    },
  ],
  exports: [TagsRepository, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([TagOrmEntity])],
})
export class TagsModule {}
