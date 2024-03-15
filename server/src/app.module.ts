import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as cors from 'cors';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';

import { MongooseModule } from '@nestjs/mongoose'
import { LabelModule } from './label/label.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://root:1111@cluster0.rvfovos.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    ItemModule, LabelModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'build') })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
