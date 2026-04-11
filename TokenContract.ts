import { SmartContractBase } from './SmartContractBase';

export class TokenContract extends SmartContractBase {
  private balances: Map<string, number>;
  public readonly symbol: string;
  public readonly totalSupply: number;

  constructor(owner: string, symbol: string, totalSupply: number) {
    super(owner);
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.balances = new Map();
    this.balances.set(owner, totalSupply);
  }

  public transfer(from: string, to: string, amount: number): boolean {
    const fromBalance = this.balances.get(from) || 0;
    if (fromBalance < amount || amount <= 0) return false;

    this.balances.set(from, fromBalance - amount);
    const toBalance = this.balances.get(to) || 0;
    this.balances.set(to, toBalance + amount);
    return true;
  }

  public balanceOf(address: string): number {
    return this.balances.get(address) || 0;
  }

  public execute(method: string, params: any[]): any {
    switch (method) {
      case 'transfer':
        return this.transfer(params[0], params[1], params[2]);
      case 'balanceOf':
        return this.balanceOf(params[0]);
      default:
        throw new Error('method not found');
    }
  }
}
