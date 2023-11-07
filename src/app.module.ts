import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '@/modules/files/files.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { TagsModule } from '@/modules/tags/tags.module';
import { PostsModule } from '@/modules/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    FilesModule,
    AuthModule,
    TagsModule,
    PostsModule,
  ],
})
export class AppModule {}
