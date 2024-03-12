import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Label } from './schema';

export class CreateLabelDto {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

@Injectable()
export class LabelService {
  constructor(@InjectModel(Label.name) private readonly labelModel: Model<Label>) {}

  async create(labelDto: CreateLabelDto): Promise<Label> {
    const createdLabel = new this.labelModel(labelDto);
    return createdLabel.save();
  }

  async findAll(): Promise<Label[]> {
    return this.labelModel.find().exec();
  }
}