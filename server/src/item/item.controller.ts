import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateItemDto, ItemService, UpdateItemDto } from "./item.service";

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
  async findAll() {
    return this.itemService.findAll();
  }
}
