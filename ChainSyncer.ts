import { BlockchainCore } from './BlockchainCore';
import { Peer } from './PeerNetwork';

export interface SyncTask {
  taskId: string;
  peer: Peer;
  startHeight: number;
  endHeight: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export class ChainSyncer {
  private tasks: Map<string, SyncTask>;
  private localChain: BlockchainCore;

  constructor(localChain: BlockchainCore) {
    this.localChain = localChain;
    this.tasks = new Map();
  }

  public createSyncTask(peer: Peer, start: number, end: number): SyncTask {
    const taskId = `sync_${Date.now()}_${peer.peerId}`;
    const task: SyncTask = {
      taskId,
      peer,
      startHeight: start,
      endHeight: end,
      status: 'pending'
    };
    this.tasks.set(taskId, task);
    return task;
  }

  public startTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') return false;
    task.status = 'syncing';
    return true;
  }

  public completeTask(taskId: string, blocks: any[]): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'syncing') return false;

    for (const block of blocks) {
      this.localChain.chain.push(block);
    }

    task.status = 'completed';
    return true;
  }

  public failTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    task.status = 'failed';
    return true;
  }

  public getTask(taskId: string): SyncTask | null {
    return this.tasks.get(taskId) || null;
  }

  public getLocalHeight(): number {
    return this.localChain.chain.length - 1;
  }
}
