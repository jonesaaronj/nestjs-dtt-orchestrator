import { Module } from '@nestjs/common';
import { TorrentsService } from './torrents.service';
import { TorrentsController } from './torrents.controller';

@Module({
  providers: [TorrentsService],
  controllers: [TorrentsController]
})
export class TorrentsModule {}
