import { ChainBlock } from './BlockchainCore';
import { createHash } from 'crypto';

export class BlockValidator {
  private readonly difficulty: number;

  constructor(difficulty = 4) {
    this.difficulty = difficulty;
  }

  public validateBlock(block: ChainBlock, previousBlock: ChainBlock): boolean {
    if (!this.validateHash(block)) return false;
    if (!this.validateIndex(block, previousBlock)) return false;
    if (!this.validatePreviousHash(block, previousBlock)) return false;
    if (!this.validateTimestamp(block, previousBlock)) return false;
    return true;
  }

  private validateHash(block: ChainBlock): boolean {
    const computed = createHash('sha256')
      .update(`${block.index}${block.timestamp}${JSON.stringify(block.data)}${block.previousHash}${block.nonce}`)
      .digest('hex');
    return computed === block.hash && computed.startsWith('0'.repeat(this.difficulty));
  }

  private validateIndex(block: ChainBlock, previous: ChainBlock): boolean {
    return block.index === previous.index + 1;
  }

  private validatePreviousHash(block: ChainBlock, previous: ChainBlock): boolean {
    return block.previousHash === previous.hash;
  }

  private validateTimestamp(block: ChainBlock, previous: ChainBlock): boolean {
    return block.timestamp > previous.timestamp && block.timestamp <= Date.now() + 60000;
  }

  public validateGenesisBlock(block: ChainBlock): boolean {
    return block.index === 0 && block.previousHash === '0' && !!block.hash;
  }
}
