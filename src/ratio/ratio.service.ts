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

  async getRatio(userKey: string): Promise<Stats> {
    const { uploaded, downloaded } = await this.ratioRepository
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
      );

    const userRatio = await this.userRatioRepository.findOneBy({
      userKey,
    });

    return {
      uploaded: uploaded + (userRatio?.uploaded ?? 0),
      downloaded: downloaded + (userRatio?.downloaded ?? 0),
    };
  }

  async reportRatio(ratio: Omit<Ratio, 'createdAt' | 'updatedAt'>) {
    const record = await this.ratioRepository.findOneBy({
      infoHash: ratio.infoHash,
      userKey: ratio.userKey,
    });

    if (!record) {
      await this.ratioRepository.save(ratio);
    } else {
      // if peerId has changed compact the ratio to userRatio
      // before updating the record
      if (record.peerId !== ratio.peerId) {
        const userRatio = await this.userRatioRepository.findOneBy({
          userKey: record.userKey,
        });

        if (userRatio) {
          await this.incrementUserRatio(
            record.userKey,
            record.uploaded,
            record.downloaded,
          );
        } else {
          await this.userRatioRepository.save({
            userKey: record.userKey,
            uploaded: record.uploaded,
            downloaded: record.downloaded,
          });
        }
      }

      // update record
      record.peerId = ratio.peerId;
      record.event = ratio.event;
      record.uploaded = ratio.uploaded;
      record.downloaded = ratio.downloaded;
      await this.ratioRepository.save(record);
    }
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
