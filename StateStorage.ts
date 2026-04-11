export interface StorageData {
  key: string;
  value: any;
  updatedAt: number;
}

export class StateStorage {
  private store: Map<string, StorageData>;
  private readonly snapshotInterval: number;
  private lastSnapshot: number;

  constructor() {
    this.store = new Map();
    this.snapshotInterval = 3600000;
    this.lastSnapshot = Date.now();
  }

  public set(key: string, value: any): void {
    this.store.set(key, {
      key,
      value,
      updatedAt: Date.now()
    });
  }

  public get(key: string): any | null {
    const data = this.store.get(key);
    return data ? data.value : null;
  }

  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }

  public createSnapshot(): StorageData[] {
    this.lastSnapshot = Date.now();
    return Array.from(this.store.values());
  }

  public loadSnapshot(data: StorageData[]): void {
    this.store.clear();
    data.forEach(item => this.store.set(item.key, item));
  }

  public needSnapshot(): boolean {
    return Date.now() - this.lastSnapshot >= this.snapshotInterval;
  }

  public listAllKeys(): string[] {
    return Array.from(this.store.keys());
  }
}
