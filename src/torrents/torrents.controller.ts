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
import { TorrentsService } from './torrents.service';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { permissionGate } from 'src/utils/permissionGate';
import { PermissionName } from 'src/jwt/jwt-payload.type';
import type { Request } from 'express';

@Controller('torrents')
export class TorrentsController {
  constructor(private torrentService: TorrentsService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  register(@Req() request: Request, @Body('infoHash') infoHash: string) {
    return permissionGate(request, PermissionName.TorrentRegister, () =>
      this.torrentService.create({ infoHash }),
    );
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  remove(@Req() request: Request, @Query('infoHash') infoHash: string) {
    return permissionGate(request, PermissionName.TorrentRemove, () =>
      this.torrentService.remove({ infoHash }),
    );
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  list(@Req() request: Request): Promise<string[]> {
    return permissionGate(request, PermissionName.TrackerList, () =>
      this.torrentService.list(),
    );
  }
}
