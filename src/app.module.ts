import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from '@/modules/files/files.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { UserOrmEntity } from '@/modules/users/entities/user.entity';
import { TagsModule } from '@/modules/tags/tags.module';
import { TagOrmEntity } from '@/modules/tags/entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserOrmEntity, TagOrmEntity],
      synchronize: true,
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    TagsModule,
  ],
})
export class AppModule {}
