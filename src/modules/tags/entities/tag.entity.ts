import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type tagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop({ unique: true, required: true })
  title: string;
}

export const tagSchema = SchemaFactory.createForClass(Tag);
