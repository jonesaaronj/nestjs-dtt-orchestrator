import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TrackerEvent } from '../ratio.types';
import { ApiProperty } from '@nestjs/swagger';

export class ReportRatioRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  infoHash: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  peerId: string;

  @ApiProperty({
    enum: TrackerEvent,
    example: TrackerEvent.Completed,
  })
  @IsNotEmpty()
  @IsEnum(TrackerEvent)
  event: TrackerEvent;

  @IsNumber()
  @ApiProperty()
  uploaded: number;

  @IsNumber()
  @ApiProperty()
  downloaded: number;
}
