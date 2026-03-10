import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateKeyPairSync } from 'crypto';
import { exportJWK, importSPKI, JWK } from 'jose';

const generateKeys = () =>
  generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

@Injectable()
export class JwksService {
  private privatePem: string;
  private publicPem: string;

  constructor() {
    const { privateKey, publicKey } = generateKeys();

    this.privatePem = privateKey;
    this.publicPem = publicKey;
  }

  getPrivatePem(): string {
    return this.privatePem;
  }

  getPublicPem(): string {
    return this.publicPem;
  }

  async getPublicJwk(): Promise<JWK> {
    const publicKey = await importSPKI(this.publicPem, 'RS256');
    return await exportJWK(publicKey);
  }

  async getPrivateJwk(): Promise<JWK> {
    const privateKey = await importSPKI(this.privatePem, 'RS256');
    return await exportJWK(privateKey);
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  rotateKeys() {
    const { privateKey, publicKey } = generateKeys();

    this.privatePem = privateKey;
    this.publicPem = publicKey;
  }
}
