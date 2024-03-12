import { Schema, Prop, SchemaFactory, MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common';

@Schema()
export class Item {
  @Prop({ unique: true })
  id: string

  @Prop()
  name: string;

  @Prop()
  day_id: string
 
  @Prop()
  index: number;

  @Prop()
  label_id: string
}

export const ItemSchema = SchemaFactory.createForClass(Item)
