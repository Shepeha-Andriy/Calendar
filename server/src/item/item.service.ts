import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
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

  async findAll(start_day: moment.Moment = moment().startOf('month').startOf('week'), end_day: moment.Moment = moment().endOf('month').endOf('week')): Promise<Item[]> {
    const days = []
    let temp_current_day = start_day.clone()
    while (!temp_current_day.isAfter(end_day)) {
      days.push(temp_current_day.format('YYYY-MM-DD'))
      temp_current_day = temp_current_day.add(1, 'day')
    }
    return this.itemModel.find({ day_id: days }).exec();
  }
}