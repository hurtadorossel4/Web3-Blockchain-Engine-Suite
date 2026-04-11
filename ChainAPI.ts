import { BlockchainCore } from './BlockchainCore';
import { WalletManager } from './WalletManager';
import { TransactionHandler } from './TransactionHandler';

export class ChainAPI {
  private core: BlockchainCore;
  private wallets: WalletManager;
  private txHandler: TransactionHandler;

  constructor() {
    this.core = new BlockchainCore();
    this.wallets = new WalletManager();
    this.txHandler = new TransactionHandler();
  }

  public createWallet() {
    return this.wallets.createWallet();
  }

  public getWallet(address: string) {
    return this.wallets.getWallet(address);
  }

  public createTransaction(from: string, to: string, amount: number) {
    return this.txHandler.createTransaction(from, to, amount);
  }

  public signTransaction(tx: any, privateKey: string) {
    return this.txHandler.signTransaction(tx, privateKey);
  }

  public mineBlock(data: any) {
    return this.core.mineBlock(data);
  }

  public getChain() {
    return this.core.chain;
  }

  public validateChain() {
    return this.core.validateChain();
  }
}
