import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Label {
  @Prop({ unique: true })
  id: string

  @Prop()
  name: string;

  @Prop()
  color: string
}

export const LabelSchema = SchemaFactory.createForClass(Label)