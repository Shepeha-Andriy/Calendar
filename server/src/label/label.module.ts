import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { LabelSchema } from './schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Label', schema: LabelSchema }])],
  controllers: [LabelController],
  providers: [LabelService],
})
export class LabelModule {}