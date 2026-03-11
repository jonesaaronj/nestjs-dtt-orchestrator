import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from './entity/stats.entity';
import { UserStats } from './entity/user_stats.entity';
import { DownloadStats } from './stats.types';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,

    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,
  ) {}

  async getStats(userKey: string, current: boolean): Promise<DownloadStats> {
    const { uploaded, downloaded } = current
      ? await this.statsRepository
          .createQueryBuilder('stats')
          .select('SUM(stats.uploaded)', 'uploaded')
          .addSelect('SUM(stats.downloaded)', 'downloaded')
          .where('stats.user_key = :userKey', { userKey })
          .getRawOne()
          .then(
            (
              e: {
                uploaded: number | string | null;
                downloaded: number | string | null;
              } | null,
            ) => ({
              uploaded: Number(e?.uploaded ?? '0'),
              downloaded: Number(e?.downloaded ?? '0'),
            }),
          )
      : { uploaded: 0, downloaded: 0 };

    const userStats = await this.userStatsRepository.findOneBy({
      userKey,
    });

    return {
      uploaded: uploaded + (userStats?.uploaded ?? 0),
      downloaded: downloaded + (userStats?.downloaded ?? 0),
    };
  }

  async reportStats(
    userKey: string,
    stats: Omit<Stats, 'userKey' | 'createdAt' | 'updatedAt'>,
  ): Promise<DownloadStats> {
    const record = await this.statsRepository.findOneBy({
      infoHash: stats.infoHash,
      userKey,
    });

    if (!record) {
      await this.statsRepository.insert({ userKey, ...stats });
    } else {
      // if peerId has changed compact the stats to userStats
      // before updating the record
      if (record.peerId !== stats.peerId) {
        const userStats = await this.userStatsRepository.findOneBy({
          userKey,
        });

        if (userStats) {
          await this.incrementUserStats(
            userKey,
            record.uploaded,
            record.downloaded,
          );
        } else {
          await this.userStatsRepository.insert({
            userKey,
            uploaded: record.uploaded,
            downloaded: record.downloaded,
          });
        }
      }

      // update record
      await this.statsRepository.update(
        { userKey },
        {
          peerId: stats.peerId,
          event: stats.event,
          uploaded: stats.uploaded,
          downloaded: stats.downloaded,
        },
      );
    }

    return await this.getStats(userKey, false);
  }

  async incrementUserStats(
    userKey: string,
    uploaded: number,
    downloaded: number,
  ) {
    await this.userStatsRepository.increment(
      {
        userKey,
      },
      'uploaded',
      uploaded,
    );
    await this.userStatsRepository.increment(
      {
        userKey,
      },
      'downloaded',
      downloaded,
    );
  }
}
