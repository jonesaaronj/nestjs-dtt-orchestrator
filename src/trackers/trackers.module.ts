import { Module } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { TrackersController } from './trackers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from './trackers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
  providers: [TrackersService],
  controllers: [TrackersController],
})
export class TrackersModule {}
