import { Module } from '@nestjs/common';
import { RatioService } from './ratio.service';
import { RatioController } from './ratio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ratio } from './entity/ratio.entity';
import { UserRatio } from './entity/user_ratio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ratio]),
    TypeOrmModule.forFeature([UserRatio]),
  ],
  providers: [RatioService],
  controllers: [RatioController],
})
export class RatioModule {}
