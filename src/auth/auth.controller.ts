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
import { JwtPayload } from 'src/jwt/jwt-payload.type';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }

  @ApiBearerAuth('jwt')
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: Request) {
    const claims = request.user as JwtPayload;
    return { claims };
  }
}
