export enum NodeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SYNCING = 'syncing'
}

export interface NetworkNode {
  nodeId: string;
  url: string;
  status: NodeStatus;
  height: number;
}

export class ConsensusEngine {
  private nodes: NetworkNode[];
  private readonly requiredVotes: number;

  constructor() {
    this.nodes = [];
    this.requiredVotes = 2;
  }

  public registerNode(node: NetworkNode): void {
    const exists = this.nodes.find(n => n.nodeId === node.nodeId);
    if (!exists) this.nodes.push(node);
  }

  public removeNode(nodeId: string): boolean {
    const index = this.nodes.findIndex(n => n.nodeId === nodeId);
    if (index === -1) return false;
    this.nodes.splice(index, 1);
    return true;
  }

  public voteForBlock(blockHeight: number): boolean {
    const activeNodes = this.nodes.filter(n => n.status === NodeStatus.ACTIVE);
    return activeNodes.length >= this.requiredVotes;
  }

  public syncNodeStatus(nodeId: string, height: number): void {
    const node = this.nodes.find(n => n.nodeId === nodeId);
    if (node) {
      node.height = height;
      node.status = height >= this.getMaxHeight() ? NodeStatus.ACTIVE : NodeStatus.SYNCING;
    }
  }

  private getMaxHeight(): number {
    return this.nodes.reduce((max, node) => Math.max(max, node.height), 0);
  }

  public getNodeList(): NetworkNode[] {
    return [...this.nodes];
  }
}
