import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { Stats } from './entity/stats.entity';
import { UserStats } from './entity/user_stats.entity';
import { StatsController } from './stats.controller';
import { Torrent } from 'src/torrents/torrents.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stats]),
    TypeOrmModule.forFeature([UserStats]),
    TypeOrmModule.forFeature([Torrent]),
  ],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
