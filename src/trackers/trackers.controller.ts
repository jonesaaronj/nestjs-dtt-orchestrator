import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { RegisterTrackerRequestDto } from './dto/RegisterTrackerRequest.dto';
import { ListTrackersResponseDto } from './dto/ListTrackersResponse.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { DeleteTrackerRequestDto } from './dto/DeleteTrackerRequest.dto';
import type { Request } from 'express';
import { permissionGate } from 'src/utils/permissionGate';
import { PermissionName } from 'src/jwt/jwt-payload.type';

@Controller('trackers')
export class TrackersController {
  constructor(private trackersService: TrackersService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  register(
    @Req() request: Request,
    @Body() registerDto: RegisterTrackerRequestDto,
  ) {
    return permissionGate(request, PermissionName.TrackerRegister, () =>
      this.trackersService.create(registerDto),
    );
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  remove(
    @Req() request: Request,
    @Query() registerDto: DeleteTrackerRequestDto,
  ) {
    return permissionGate(request, PermissionName.TrackerDelete, () =>
      this.trackersService.remove(registerDto),
    );
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  list(@Req() request: Request): Promise<ListTrackersResponseDto> {
    return permissionGate(request, PermissionName.TrackerList, (userKey) =>
      this.trackersService.list(userKey).then((trackers) => ({ trackers })),
    );
  }
}
