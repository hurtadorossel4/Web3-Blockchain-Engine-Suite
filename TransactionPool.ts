import { Transaction } from './TransactionHandler';

export class TransactionPool {
  private pool: Map<string, Transaction>;
  private readonly maxSize: number;

  constructor() {
    this.pool = new Map();
    this.maxSize = 500;
  }

  private generateTxId(transaction: Transaction): string {
    return `tx_${transaction.from}${transaction.to}${transaction.amount}${transaction.timestamp}`;
  }

  public addTransaction(transaction: Transaction): boolean {
    if (this.pool.size >= this.maxSize) return false;
    const txId = this.generateTxId(transaction);
    this.pool.set(txId, transaction);
    return true;
  }

  public removeTransaction(txId: string): boolean {
    return this.pool.delete(txId);
  }

  public getPendingTransactions(limit = 50): Transaction[] {
    return Array.from(this.pool.values()).slice(0, limit);
  }

  public clearPool(): void {
    this.pool.clear();
  }

  public getPoolSize(): number {
    return this.pool.size;
  }

  public hasTransaction(txId: string): boolean {
    return this.pool.has(txId);
  }
}
