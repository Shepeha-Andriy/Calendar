import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('client')
  root(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'build', 'index.html'));
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
