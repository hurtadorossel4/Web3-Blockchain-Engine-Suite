export interface ContractState {
  [key: string]: any;
}

export abstract class SmartContractBase {
  public readonly contractAddress: string;
  protected state: ContractState;
  private readonly owner: string;

  constructor(owner: string) {
    this.owner = owner;
    this.contractAddress = this.generateAddress();
    this.state = {};
  }

  private generateAddress(): string {
    const random = Math.random().toString(16).slice(2);
    return `0x${random.padStart(40, '0')}`;
  }

  protected onlyOwner(caller: string): boolean {
    return caller === this.owner;
  }

  public setState(key: string, value: any, caller: string): boolean {
    if (!this.onlyOwner(caller)) return false;
    this.state[key] = value;
    return true;
  }

  public getState(key: string): any {
    return this.state[key] ?? null;
  }

  public abstract execute(method: string, params: any[]): any;

  public getOwner(): string {
    return this.owner;
  }
}
