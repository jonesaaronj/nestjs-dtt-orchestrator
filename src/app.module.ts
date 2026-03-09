import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { Permission } from './users/entities/permissions.entity';
import { Role } from './users/entities/roles.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwksModule } from './jwks/jwks.module';
import { TrackersModule } from './trackers/trackers.module';
import { Tracker } from './trackers/trackers.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'postgres'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'password'),
        database: configService.get<string>('POSTGRES_DB', 'nest_auth_db'),
        entities: [User, Role, Permission, Tracker],
        synchronize: true, // TODO: Disable in production
      }),
    }),

    AuthModule,
    JwksModule,
    UsersModule,
    TrackersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
