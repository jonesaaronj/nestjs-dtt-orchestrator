import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { PermissionName } from 'src/users/entities/permissions.entity';

@Controller('trackers')
export class TrackersController {
  constructor(private trackersService: TrackersService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(
    @Req() request: Request,
    @Body() registerDto: RegisterTrackerRequestDto,
  ) {
    const isAdmin = request.user?.permissions?.includes(PermissionName.Viewer);

    // TODO: use permission
    await this.trackersService.create(registerDto);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Req() request: Request,
    @Query() registerDto: DeleteTrackerRequestDto,
  ) {
    const isAdmin = request.user?.permissions?.includes(PermissionName.Viewer);

    // TODO: use permission
    await this.trackersService.remove(registerDto);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Req() request: Request): Promise<ListTrackersResponseDto> {
    const userKey = request.user?.sub;

    if (!userKey) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return { trackers: await this.trackersService.list(userKey) };
  }
}
