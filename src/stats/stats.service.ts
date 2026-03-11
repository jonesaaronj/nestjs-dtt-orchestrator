import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from './entity/stats.entity';
import { UserStats } from './entity/user_stats.entity';
import { DownloadStats } from './stats.types';
import { Torrent } from 'src/torrents/torrents.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,

    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,

    @InjectRepository(Torrent)
    private readonly torrentsRepository: Repository<Torrent>,
  ) {}

  async reportStats(
    userKey: string,
    { infoHash, ...stats }: Omit<Stats, 'userKey' | 'createdAt' | 'updatedAt'>,
  ): Promise<DownloadStats | undefined> {
    const torrentRecord = await this.torrentsRepository.findOneBy({
      infoHash,
    });

    if (!torrentRecord) {
      return;
    }

    const statsRecord = await this.statsRepository.findOneBy({
      infoHash,
      userKey,
    });

    if (!statsRecord) {
      await this.statsRepository.insert({ userKey, infoHash, ...stats });
    } else {
      // if peerId has changed compact the stats to userStats
      // before updating the record
      if (statsRecord.peerId !== stats.peerId) {
        const userStats = await this.userStatsRepository.findOneBy({
          userKey,
        });

        if (userStats) {
          // take into account torrent ratio modifiers
          await this.incrementUserStats(
            userKey,
            torrentRecord.uploadModifier * statsRecord.uploaded,
            torrentRecord.downloadModifier * statsRecord.downloaded,
          );
        } else {
          await this.userStatsRepository.insert({
            userKey,
            uploaded: statsRecord.uploaded,
            downloaded: statsRecord.downloaded,
          });
        }
      }

      // update torrent stats record
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

  async getStats(userKey: string, current: boolean): Promise<DownloadStats> {
    const { uploaded, downloaded } = current
      ? await this.statsRepository
          .createQueryBuilder('stats')
          .leftJoinAndSelect('stats.info_hash', 'torrent')
          .select('SUM(torrent.upload_modifier + stats.uploaded)', 'uploaded')
          .addSelect(
            'SUM(torrent.download_modifier + stats.downloaded)',
            'downloaded',
          )
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
}
