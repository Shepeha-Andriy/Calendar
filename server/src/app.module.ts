import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as cors from 'cors';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';

import { MongooseModule } from '@nestjs/mongoose'
import { LabelModule } from './label/label.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://root:1111@cluster0.rvfovos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    ItemModule, LabelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*'); // Використовуйте '*' для включення CORS для всіх маршрутів
  }
}
