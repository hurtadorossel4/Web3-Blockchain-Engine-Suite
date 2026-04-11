import { createHash } from 'crypto';

export interface ChainBlock {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

export class BlockchainCore {
  public chain: ChainBlock[];
  private readonly difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  private createGenesisBlock(): ChainBlock {
    const genesisData = { network: 'web3-chain', init: true };
    return {
      index: 0,
      timestamp: Date.now(),
      data: genesisData,
      previousHash: '0',
      hash: this.computeHash(0, Date.now(), genesisData, '0', 0),
      nonce: 0
    };
  }

  private computeHash(
    index: number,
    timestamp: number,
    data: any,
    previousHash: string,
    nonce: number
  ): string {
    const raw = `${index}${timestamp}${JSON.stringify(data)}${previousHash}${nonce}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  private getLatestBlock(): ChainBlock {
    return this.chain[this.chain.length - 1];
  }

  public mineBlock(data: any): ChainBlock {
    const latest = this.getLatestBlock();
    let nonce = 0;
    let hash: string;

    do {
      nonce++;
      hash = this.computeHash(
        latest.index + 1,
        Date.now(),
        data,
        latest.hash,
        nonce
      );
    } while (!hash.startsWith('0'.repeat(this.difficulty)));

    const newBlock: ChainBlock = {
      index: latest.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: latest.hash,
      hash,
      nonce
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  public validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== this.computeHash(
        current.index,
        current.timestamp,
        current.data,
        current.previousHash,
        current.nonce
      )) return false;

      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}
