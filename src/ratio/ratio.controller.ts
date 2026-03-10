import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RatioService } from './ratio.service';
import { ReportRatioRequestDto } from './dto/ReportRatioRequest.dto';
import { GetRatioRequestDto } from './dto/GetRatioRequest.dto';
import { GetRatioResponseDto } from './dto/GetRatioResponse.dto';
import { ReportRatioResponseDto } from './dto/ReportRatioResponse.dto';
import type { Request } from 'express';
import { PermissionName } from 'src/jwt/jwt-payload.type';
import { permissionGate } from 'src/utils/permissionGate';

@Controller('ratio')
export class RatioController {
  constructor(private readonly ratioService: RatioService) {}

  @Post('report')
  reportRatio(
    @Body() reportRatioRequest: ReportRatioRequestDto,
    @Req() request: Request,
  ): Promise<ReportRatioResponseDto> {
    return permissionGate(request, PermissionName.Viewer, (userKey) =>
      this.ratioService.reportRatio(userKey, reportRatioRequest),
    );
  }

  @Get()
  getRatio(
    @Query() getRatioRequest: GetRatioRequestDto,
    @Req() request: Request,
  ): Promise<GetRatioResponseDto> {
    return permissionGate(request, PermissionName.Viewer, (userKey) =>
      this.ratioService.getRatio(userKey, getRatioRequest.current),
    );
  }
}
