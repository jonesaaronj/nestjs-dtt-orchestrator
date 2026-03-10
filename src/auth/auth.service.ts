import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { CustomJwtPayload } from 'src/jwt/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.usersService.findByEmail(hashedEmail);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    return this.usersService.create({
      email: hashedEmail,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');

    const user = await this.usersService.findByEmail(hashedEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = await this.usersService
      .getPermissions(email)
      .then((permissions) =>
        permissions.map((permission) => permission.permission),
      );

    const payload: CustomJwtPayload = {
      sub: user.key,
      permissions,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }
}
