import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateItemDto, ItemService, UpdateItemDto } from "./item.service";
import * as moment from 'moment';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Post('update')
  async update(@Body() updateItemDto: UpdateItemDto[]) {
    return this.itemService.update(updateItemDto);
  }

  @Get()
  async findAll(@Query('start_day') start_day: string, @Query('end_day') end_day: string) {
    // return this.itemService.findAll(start_day, end_day);
    return this.itemService.findAll(moment(start_day), moment(end_day));
  }
}
