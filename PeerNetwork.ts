export interface Peer {
  peerId: string;
  host: string;
  port: number;
  lastSeen: number;
}

export class PeerNetwork {
  private peers: Map<string, Peer>;
  private readonly timeout: number;

  constructor() {
    this.peers = new Map();
    this.timeout = 300000;
  }

  public addPeer(peerId: string, host: string, port: number): void {
    this.peers.set(peerId, {
      peerId,
      host,
      port,
      lastSeen: Date.now()
    });
  }

  public removePeer(peerId: string): boolean {
    return this.peers.delete(peerId);
  }

  public refreshPeer(peerId: string): boolean {
    const peer = this.peers.get(peerId);
    if (!peer) return false;
    peer.lastSeen = Date.now();
    return true;
  }

  public getActivePeers(): Peer[] {
    const now = Date.now();
    return Array.from(this.peers.values())
      .filter(p => now - p.lastSeen < this.timeout);
  }

  public getAllPeers(): Peer[] {
    return Array.from(this.peers.values());
  }

  public cleanInactive(): number {
    const now = Date.now();
    const before = this.peers.size;
    for (const [id, peer] of this.peers) {
      if (now - peer.lastSeen >= this.timeout) {
        this.peers.delete(id);
      }
    }
    return before - this.peers.size;
  }
}
