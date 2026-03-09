import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterTrackerRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/.*{{userKey}}.*/, {
    message: 'uri must contain magic string {{userKey}}',
  })
  uri: string;
}
