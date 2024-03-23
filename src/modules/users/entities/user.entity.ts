import mongoose, { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleEntity } from '@/domains/entities';

export type userDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  desc: string;

  @Prop({ default: RoleEntity.USER })
  role: RoleEntity;

  @Prop({ default: '/uploads/avatar.png' })
  avatar: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  likedPosts: ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  bookmarks: ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(User);
