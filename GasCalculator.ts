export interface GasConfig {
  baseFee: number;
  txFee: number;
  contractFee: number;
  storageFeePerByte: number;
}

export class GasCalculator {
  private config: GasConfig;

  constructor() {
    this.config = {
      baseFee: 10,
      txFee: 50,
      contractFee: 200,
      storageFeePerByte: 0.1
    };
  }

  public calculateTransferGas(): number {
    return this.config.baseFee + this.config.txFee;
  }

  public calculateContractDeployGas(codeSize: number): number {
    const storageFee = codeSize * this.config.storageFeePerByte;
    return this.config.baseFee + this.config.contractFee + storageFee;
  }

  public calculateStorageGas(dataSize: number): number {
    return this.config.baseFee + dataSize * this.config.storageFeePerByte;
  }

  public calculateBatchTxsGas(count: number): number {
    const base = this.calculateTransferGas();
    return base * count + (count > 10 ? 50 : 0);
  }

  public updateConfig(newConfig: Partial<GasConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): GasConfig {
    return { ...this.config };
  }
}
