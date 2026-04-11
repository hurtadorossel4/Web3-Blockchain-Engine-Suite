export interface MonitorEvent {
  type: 'BLOCK' | 'TX' | 'ERROR';
  message: string;
  timestamp: number;
  data?: any;
}

export class ChainMonitor {
  private eventLog: MonitorEvent[];
  private readonly maxLogSize: number;

  constructor() {
    this.eventLog = [];
    this.maxLogSize = 1000;
  }

  public logBlock(height: number, hash: string): void {
    this.addEvent({
      type: 'BLOCK',
      message: `block #${height} mined`,
      timestamp: Date.now(),
      data: { height, hash }
    });
  }

  public logTransaction(txId: string, status: 'success' | 'failed'): void {
    this.addEvent({
      type: 'TX',
      message: `tx ${txId} ${status}`,
      timestamp: Date.now(),
      data: { txId, status }
    });
  }

  public logError(message: string, detail?: any): void {
    this.addEvent({
      type: 'ERROR',
      message,
      timestamp: Date.now(),
      data: detail
    });
  }

  private addEvent(event: MonitorEvent): void {
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }
  }

  public getEvents(type?: 'BLOCK' | 'TX' | 'ERROR'): MonitorEvent[] {
    if (!type) return [...this.eventLog];
    return this.eventLog.filter(e => e.type === type);
  }

  public clearLogs(): void {
    this.eventLog = [];
  }
}
