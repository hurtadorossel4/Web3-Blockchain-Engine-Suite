import { BlockchainCore } from './BlockchainCore';
import { TransactionPool } from './TransactionPool';
import { TransactionHandler } from './TransactionHandler';

export class BlockMiner {
  private chain: BlockchainCore;
  private pool: TransactionPool;
  private handler: TransactionHandler;
  private minerAddress: string;

  constructor(
    chain: BlockchainCore,
    pool: TransactionPool,
    handler: TransactionHandler,
    minerAddress: string
  ) {
    this.chain = chain;
    this.pool = pool;
    this.handler = handler;
    this.minerAddress = minerAddress;
  }

  public mineNextBlock(): any {
    const txs = this.pool.getPendingTransactions(30);
    const validTxs = txs.filter(tx => this.handler.validateTransaction(tx));

    const blockData = {
      miner: this.minerAddress,
      transactions: validTxs,
      reward: 1.25
    };

    const block = this.chain.mineBlock(blockData);
    for (const tx of validTxs) {
      const txId = `tx_${tx.from}${tx.to}${tx.amount}${tx.timestamp}`;
      this.pool.removeTransaction(txId);
    }

    return block;
  }

  public setMinerAddress(address: string): void {
    this.minerAddress = address;
  }

  public getMinerAddress(): string {
    return this.minerAddress;
  }
}
