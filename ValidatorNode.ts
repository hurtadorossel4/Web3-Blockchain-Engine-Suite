import { ConsensusEngine } from './ConsensusEngine';
import { BlockValidator } from './BlockValidator';
import { ChainBlock } from './BlockchainCore';

export interface NodeStats {
  nodeId: string;
  blocksValidated: number;
  uptime: number;
  lastBlockHeight: number;
}

export class ValidatorNode {
  public readonly nodeId: string;
  private consensus: ConsensusEngine;
  private validator: BlockValidator;
  private stats: NodeStats;
  private startTime: number;

  constructor() {
    this.nodeId = `node_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    this.consensus = new ConsensusEngine();
    this.validator = new BlockValidator();
    this.startTime = Date.now();
    this.stats = {
      nodeId: this.nodeId,
      blocksValidated: 0,
      uptime: 0,
      lastBlockHeight: 0
    };
  }

  public validateAndPropose(block: ChainBlock, previous: ChainBlock): boolean {
    const valid = this.validator.validateBlock(block, previous);
    if (!valid) return false;

    this.stats.blocksValidated++;
    this.stats.lastBlockHeight = block.index;
    return this.consensus.voteForBlock(block.index);
  }

  public getStats(): NodeStats {
    this.stats.uptime = Date.now() - this.startTime;
    return { ...this.stats };
  }

  public registerPeer(peerId: string): void {
    this.consensus.registerNode({
      nodeId: peerId,
      url: `p2p://${peerId}`,
      status: 'active',
      height: this.stats.lastBlockHeight
    });
  }
}
