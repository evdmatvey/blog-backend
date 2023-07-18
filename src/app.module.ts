import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from '@/modules/files/files.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { TagsModule } from '@/modules/tags/tags.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    FilesModule,
    AuthModule,
    TagsModule,
  ],
})
export class AppModule {}
