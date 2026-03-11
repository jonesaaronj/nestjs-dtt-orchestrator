import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { PermissionName } from 'src/jwt/jwt-payload.type';
import { permissionGate } from 'src/utils/permissionGate';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { StatsService } from './stats.service';
import { ReportStatsRequestDto } from './dto/ReportStatsRequest.dto';
import { ReportStatsResponseDto } from './dto/ReportStatsResponse.dto';
import { GetStatsRequestDto } from './dto/GetStatsRequest.dto';
import { GetStatsResponseDto } from './dto/GetStatsResponse.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Put('report')
  @UseGuards(JwtAuthGuard)
  reportStats(
    @Body() reportStatsRequest: ReportStatsRequestDto,
    @Req() request: Request,
  ): Promise<ReportStatsResponseDto> {
    return permissionGate(request, PermissionName.Viewer, (userKey) =>
      this.statsService.reportStats(userKey, reportStatsRequest),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getStats(
    @Query() getStatsRequest: GetStatsRequestDto,
    @Req() request: Request,
  ): Promise<GetStatsResponseDto> {
    return permissionGate(request, PermissionName.Viewer, (userKey) =>
      this.statsService.getStats(userKey, getStatsRequest.current),
    );
  }
}
