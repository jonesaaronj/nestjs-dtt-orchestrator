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

@Controller('ratio')
export class RatioController {
  constructor(private readonly ratioService: RatioService) {}

  @Post('report')
  reportRatio(
    @Body() reportRatioRequest: ReportRatioRequestDto,
    @Req() request: Request,
  ): Promise<ReportRatioResponseDto> {
    const userKey = request.user?.sub;

    if (!userKey) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.ratioService.reportRatio(userKey, reportRatioRequest);
  }

  @Get()
  getRatio(
    @Query() getRatioRequest: GetRatioRequestDto,
    @Req() request: Request,
  ): Promise<GetRatioResponseDto> {
    const userKey = request.user?.sub;

    if (!userKey) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.ratioService.getRatio(userKey, getRatioRequest.current);
  }
}
