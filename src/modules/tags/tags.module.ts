import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CreateTagUseCaseSymbol,
  SearchTagUseCaseSymbol,
} from '@/domains/ports/in';
import { TagRepositoryPort } from '@/domains/ports/out';
import { SearchTagService, CreateTagService } from '@/domains/services';
import { Tag, tagSchema } from './entities/tag.entity';
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
    {
      provide: SearchTagUseCaseSymbol,
      useClass: SearchTagService,
    },
    {
      provide: SearchTagUseCaseSymbol,
      useFactory: (_tagRepository: TagRepositoryPort) => {
        return new SearchTagService(_tagRepository);
      },
      inject: [TagsRepository],
    },
  ],
  exports: [TagsRepository],
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: tagSchema }])],
})
export class TagsModule {}
