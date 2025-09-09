import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusesModule } from './statuses/statuses.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, StatusesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
