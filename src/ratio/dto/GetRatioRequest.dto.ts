import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRatioRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'xyz',
    description: 'the user key',
  })
  userKey: string;
}
