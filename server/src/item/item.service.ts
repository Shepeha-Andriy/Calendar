import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './schema';

export class CreateItemDto {
  readonly id: string;
  readonly name: string;
  readonly day_id: string;
  readonly label_id?: string;
  readonly index: number;
}

export class UpdateItemDto {
  readonly id: string;
  readonly name?: string;
  readonly day_id?: string;
  readonly label_id?: string;
  readonly index?: number;
}

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<Item>) {}

  async create(itemDto: CreateItemDto): Promise<Item> {
    const createdItem = new this.itemModel(itemDto);
    return createdItem.save();
  }

  async update(itemDtos: UpdateItemDto[]): Promise<boolean> {
    // throw Error('err')
    for (const item of itemDtos) {
      const res = this.itemModel.updateOne({ id: item.id }, item)
      if (!(await res).acknowledged) throw Error('')
    }
    return true
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }
}