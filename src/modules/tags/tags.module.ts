import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateTagUseCaseSymbol } from '@/domains/ports/in';
import { CreateTagService } from '@/domains/services/create-tag.service';
import { TagRepositoryPort } from '@/domains/ports/out';
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
  ],
  exports: [TagsRepository],
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: tagSchema }])],
})
export class TagsModule {}
