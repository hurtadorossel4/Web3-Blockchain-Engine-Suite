import { SmartContractBase } from './SmartContractBase';

export interface ExecuteResult {
  success: boolean;
  data?: any;
  error?: string;
  gasUsed: number;
}

export class ContractExecutor {
  private contracts: Map<string, SmartContractBase>;

  constructor() {
    this.contracts = new Map();
  }

  public deployContract(contract: SmartContractBase): string {
    const address = contract.contractAddress;
    this.contracts.set(address, contract);
    return address;
  }

  public execute(
    contractAddress: string,
    method: string,
    params: any[],
    caller: string
  ): ExecuteResult {
    const contract = this.contracts.get(contractAddress);
    if (!contract) {
      return { success: false, error: 'contract not found', gasUsed: 10 };
    }

    try {
      const result = contract.execute(method, params);
      return {
        success: true,
        data: result,
        gasUsed: 150
      };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message,
        gasUsed: 50
      };
    }
  }

  public getContract(address: string): SmartContractBase | null {
    return this.contracts.get(address) || null;
  }

  public listContracts(): string[] {
    return Array.from(this.contracts.keys());
  }
}
