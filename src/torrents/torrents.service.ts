import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Torrent } from './torrents.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TorrentsService {
  constructor(
    @InjectRepository(Torrent)
    private readonly torrentRepository: Repository<Torrent>,
  ) {}

  async create(data: Partial<Torrent>): Promise<Torrent> {
    return this.torrentRepository.save(data);
  }

  async remove(data: Partial<Torrent>): Promise<DeleteResult> {
    return this.torrentRepository.delete(data);
  }

  async list(): Promise<string[]> {
    return (await this.torrentRepository.find()).map((e) => e.infoHash);
  }
}
