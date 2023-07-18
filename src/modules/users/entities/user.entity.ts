import { RoleEntity } from '@/domains/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type userDocument = User & Document;

@Schema()
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
}

export const userSchema = SchemaFactory.createForClass(User);
