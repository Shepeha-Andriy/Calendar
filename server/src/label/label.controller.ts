import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateLabelDto, LabelService } from "./label.service";

@Controller('labels')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  async create(@Body() createLabelrDto: CreateLabelDto) {
    return this.labelService.create(createLabelrDto);
  }

  @Get()
  async findAll() {
    return this.labelService.findAll();
  }
}