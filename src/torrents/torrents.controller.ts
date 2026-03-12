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
import type { FastifyRequest } from 'fastify';

@Controller('torrents')
export class TorrentsController {
  constructor(private torrentService: TorrentsService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  register(@Req() request: FastifyRequest, @Body('infoHash') infoHash: string) {
    return permissionGate(request, PermissionName.TorrentRegister, () =>
      this.torrentService.create({ infoHash }),
    );
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  remove(@Req() request: FastifyRequest, @Query('infoHash') infoHash: string) {
    return permissionGate(request, PermissionName.TorrentRemove, () =>
      this.torrentService.remove({ infoHash }),
    );
  }

  @Get('allowed')
  @UseGuards(JwtAuthGuard)
  async get(
    @Req() request: FastifyRequest,
    @Query('infoHash') infoHash: string,
  ): Promise<{ allowed: boolean }> {
    return permissionGate(request, PermissionName.TrackerList, () =>
      this.torrentService.get({ infoHash }),
    ).then((e) => ({
      allowed: !!e,
    }));
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(@Req() request: FastifyRequest): Promise<string[]> {
    return permissionGate(request, PermissionName.TrackerList, () =>
      this.torrentService.list(),
    ).then((e) => e.map((e) => e.infoHash));
  }
}
