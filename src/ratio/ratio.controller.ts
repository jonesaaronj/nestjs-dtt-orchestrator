import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { RatioService } from './ratio.service';
import { ReportRatioRequestDto } from './dto/ReportRatioRequest.dto';
import { GetRatioRequestDto } from './dto/GetRatioRequest.dto';
import { GetRatioResponseDto } from './dto/GetRatioResponse.dto';

@Controller('ratio')
export class RatioController {
  constructor(private readonly ratioService: RatioService) {}

  @Post('report')
  reportRatio(@Body() reportRatioRequest: ReportRatioRequestDto) {
    return this.ratioService.reportRatio(reportRatioRequest);
  }

  @Get()
  getRatio(
    @Query() getRatioRequest: GetRatioRequestDto,
  ): Promise<GetRatioResponseDto> {
    return this.ratioService.getRatio(getRatioRequest.userKey);
  }
}
