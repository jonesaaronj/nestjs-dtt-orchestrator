import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/LoginResponse.dto';
import { LoginRequestDto } from './dto/LoginRequest.dto';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomJwtPayload, PermissionName } from 'src/jwt/jwt-payload.type';
import { permissionGate } from 'src/utils/permissionGate';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // TODO: protect registration???
  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto) {
    await this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const token = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60,
    });

    return { token };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return permissionGate(request, PermissionName.Viewer, () => {
      response.clearCookie('access_token');
      return Promise.resolve({ message: 'Logout successful' });
    });
  }

  @ApiBearerAuth('jwt')
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: Request): Promise<CustomJwtPayload> {
    return permissionGate(
      request,
      PermissionName.Viewer,
      (_userKey, user): Promise<CustomJwtPayload> => {
        return Promise.resolve(user);
      },
    );
  }
}
