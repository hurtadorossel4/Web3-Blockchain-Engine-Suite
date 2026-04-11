import { createHmac } from 'crypto';

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  signature?: string;
}

export class TransactionHandler {
  public createTransaction(from: string, to: string, amount: number): Transaction {
    return {
      from,
      to,
      amount,
      timestamp: Date.now()
    };
  }

  public signTransaction(transaction: Transaction, privateKey: string): Transaction {
    const raw = `${transaction.from}${transaction.to}${transaction.amount}${transaction.timestamp}`;
    const signature = createHmac('sha256', privateKey).update(raw).digest('hex');
    return { ...transaction, signature };
  }

  public verifyTransaction(transaction: Transaction, publicKey: string): boolean {
    if (!transaction.signature) return false;
    const raw = `${transaction.from}${transaction.to}${transaction.amount}${transaction.timestamp}`;
    const verify = createHmac('sha256', publicKey).update(raw).digest('hex');
    return verify === transaction.signature;
  }

  public validateTransaction(transaction: Transaction): boolean {
    if (transaction.amount <= 0) return false;
    if (!transaction.from || !transaction.to) return false;
    if (transaction.from === transaction.to) return false;
    return true;
  }
}
