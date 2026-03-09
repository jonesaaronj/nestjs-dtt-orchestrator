import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwksService } from 'src/jwks/jwks.service';
import { JwksModule } from 'src/jwks/jwks.module';

@Module({
  imports: [
    UsersModule,
    JwksModule,
    JwtModule.registerAsync({
      imports: [JwksModule],
      useFactory: (jwksService: JwksService) => {
        const privateKey = jwksService.getPrivatePem();
        const publicKey = jwksService.getPublicPem();

        //console.log('Using privateKey:\n' + privateKey);
        //console.log('Using publicKey:\n' + publicKey);

        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '1h',
          },
          verifyOptions: {
            algorithms: ['RS256'],
          },
        };
      },
      inject: [JwksService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
