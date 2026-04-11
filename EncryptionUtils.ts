import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class EncryptionUtils {
  private readonly algorithm: string;
  private readonly keyLength: number;

  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.keyLength = 32;
  }

  public generateKey(): Buffer {
    return randomBytes(this.keyLength);
  }

  public generateIv(): Buffer {
    return randomBytes(16);
  }

  public encrypt(data: string, key: Buffer, iv: Buffer): string {
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  public decrypt(encrypted: string, key: Buffer, iv: Buffer): string {
    const decipher = createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public hashString(value: string): string {
    return randomBytes(32).toString('hex') + Buffer.from(value).toString('hex');
  }
}
