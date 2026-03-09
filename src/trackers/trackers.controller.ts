import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { RegisterTrackerRequestDto } from './dto/RegisterTrackerRequest.dto';
import { ListTrackersRequestDto } from './dto/ListTrackersRequest.dto';
import { ListTrackersResponseDto } from './dto/ListTrackersResponse.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { DeleteTrackerRequestDto } from './dto/DeleteTrackerRequest.dto';

@Controller('trackers')
export class TrackersController {
  constructor(private trackersService: TrackersService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(@Body() registerDto: RegisterTrackerRequestDto) {
    await this.trackersService.create(registerDto);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Body() registerDto: DeleteTrackerRequestDto) {
    await this.trackersService.remove(registerDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  async list(
    @Body() request: ListTrackersRequestDto,
  ): Promise<ListTrackersResponseDto> {
    return { trackers: await this.trackersService.list(request.userKey) };
  }
}
