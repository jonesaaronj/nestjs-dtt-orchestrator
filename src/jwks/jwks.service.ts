import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';
import { exportJWK, importSPKI, JWK } from 'jose';

@Injectable()
export class JwksService {
  private readonly privatePem: string;
  private readonly publicPem: string;

  constructor() {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
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

    //console.log('Using privateKey2:\n' + privateKey);
    //console.log('Using publicKey2:\n' + publicKey);

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
}
