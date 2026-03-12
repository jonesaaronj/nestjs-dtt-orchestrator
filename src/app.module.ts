import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwksModule } from './jwks/jwks.module';
import { TrackersModule } from './trackers/trackers.module';
import { Tracker } from './trackers/trackers.entity';
import { HealthModule } from './health/health.module';
import { TorrentsModule } from './torrents/torrents.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/users.entity';
import { Role } from './roles/roles.entity';
import { StatsModule } from './stats/stats.module';
import { Stats } from './stats/entity/stats.entity';
import { UserStats } from './stats/entity/user_stats.entity';
import { Torrent } from './torrents/torrents.entity';

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
        entities: [User, Role, Torrent, Tracker, Stats, UserStats],
        synchronize: true, // TODO: Disable in production
      }),
    }),
    HealthModule,
    AuthModule,
    JwksModule,
    UsersModule,
    TrackersModule,
    StatsModule,
    TorrentsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
