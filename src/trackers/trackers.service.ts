import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './trackers.entity';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';

const magic = '{{userKey}}';

@Injectable()
export class TrackersService {
  constructor(
    @InjectRepository(Tracker)
    private readonly trackerRepository: Repository<Tracker>,
  ) {}

  async create(data: Partial<Tracker>): Promise<Tracker> {
    return this.trackerRepository.save(data);
  }

  async remove(data: Partial<Tracker>): Promise<DeleteResult> {
    return this.trackerRepository.delete(data);
  }

  async list(userKey: string): Promise<string[]> {
    return (await this.trackerRepository.findBy({})).map((tracker) =>
      tracker.uri.replace(magic, userKey),
    );
  }
}
