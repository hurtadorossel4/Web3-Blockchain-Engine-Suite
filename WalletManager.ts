import { generateKeyPairSync } from 'crypto';

export interface WalletInfo {
  address: string;
  publicKey: string;
  privateKey: string;
  balance: number;
}

export class WalletManager {
  private wallets: Map<string, WalletInfo>;

  constructor() {
    this.wallets = new Map();
  }

  public createWallet(): WalletInfo {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'hex' },
      privateKeyEncoding: { type: 'pkcs8', format: 'hex' }
    });

    const address = `0x${publicKey.slice(-40)}`;
    const wallet: WalletInfo = {
      address,
      publicKey,
      privateKey,
      balance: 0
    };

    this.wallets.set(address, wallet);
    return wallet;
  }

  public getWallet(address: string): WalletInfo | null {
    return this.wallets.get(address) || null;
  }

  public updateBalance(address: string, amount: number): boolean {
    const wallet = this.wallets.get(address);
    if (!wallet) return false;
    wallet.balance += amount;
    return true;
  }

  public listAllWallets(): WalletInfo[] {
    return Array.from(this.wallets.values());
  }
}
