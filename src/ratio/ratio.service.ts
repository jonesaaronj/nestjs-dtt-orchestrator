import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ratio } from './entity/ratio.entity';
import { UserRatio } from './entity/user_ratio.entity';
import { Stats } from './ratio.types';

@Injectable()
export class RatioService {
  constructor(
    @InjectRepository(Ratio)
    private readonly ratioRepository: Repository<Ratio>,

    @InjectRepository(UserRatio)
    private readonly userRatioRepository: Repository<UserRatio>,
  ) {}

  async getRatio(userKey: string, current: boolean): Promise<Stats> {
    const { uploaded, downloaded } = current
      ? await this.ratioRepository
          .createQueryBuilder('ratio')
          .select('SUM(ratio.uploaded)', 'uploaded')
          .addSelect('SUM(ratio.downloaded)', 'downloaded')
          .where('ratio.user_key = :userKey', { userKey })
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

    const userRatio = await this.userRatioRepository.findOneBy({
      userKey,
    });

    return {
      uploaded: uploaded + (userRatio?.uploaded ?? 0),
      downloaded: downloaded + (userRatio?.downloaded ?? 0),
    };
  }

  async reportRatio(
    userKey: string,
    ratio: Omit<Ratio, 'userKey' | 'createdAt' | 'updatedAt'>,
  ): Promise<Stats> {
    const record = await this.ratioRepository.findOneBy({
      infoHash: ratio.infoHash,
      userKey,
    });

    if (!record) {
      await this.ratioRepository.insert({ userKey, ...ratio });
    } else {
      // if peerId has changed compact the ratio to userRatio
      // before updating the record
      if (record.peerId !== ratio.peerId) {
        const userRatio = await this.userRatioRepository.findOneBy({
          userKey,
        });

        if (userRatio) {
          await this.incrementUserRatio(
            userKey,
            record.uploaded,
            record.downloaded,
          );
        } else {
          await this.userRatioRepository.insert({
            userKey,
            uploaded: record.uploaded,
            downloaded: record.downloaded,
          });
        }
      }

      // update record
      await this.ratioRepository.update(
        { userKey },
        {
          peerId: ratio.peerId,
          event: ratio.event,
          uploaded: ratio.uploaded,
          downloaded: ratio.downloaded,
        },
      );
    }

    return await this.getRatio(userKey, false);
  }

  async incrementUserRatio(
    userKey: string,
    uploaded: number,
    downloaded: number,
  ) {
    await this.userRatioRepository.increment(
      {
        userKey,
      },
      'uploaded',
      uploaded,
    );
    await this.userRatioRepository.increment(
      {
        userKey,
      },
      'downloaded',
      downloaded,
    );
  }
}
