import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListTrackersRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userKey: string;
}
