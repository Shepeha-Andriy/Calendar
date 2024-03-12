import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateItemDto, ItemService } from "./item.service";

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  async findAll() {
    return this.itemService.findAll();
  }
}
