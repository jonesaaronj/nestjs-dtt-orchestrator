import { Module } from '@nestjs/common';
import { TorrentsService } from './torrents.service';
import { TorrentsController } from './torrents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torrent } from './torrents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Torrent])],
  providers: [TorrentsService],
  controllers: [TorrentsController],
})
export class TorrentsModule {}
