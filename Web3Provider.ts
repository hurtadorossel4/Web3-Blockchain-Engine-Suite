export interface RequestPayload {
  method: string;
  params: any[];
  id: string;
  jsonrpc: string;
}

export class Web3Provider {
  private readonly rpcUrl: string;
  private timeout: number;

  constructor(rpcUrl: string) {
    this.rpcUrl = rpcUrl;
    this.timeout = 10000;
  }

  private createPayload(method: string, params: any[]): RequestPayload {
    return {
      method,
      params,
      id: Math.random().toString(16).slice(2),
      jsonrpc: '2.0'
    };
  }

  public async request<T>(method: string, params: any[] = []): Promise<T> {
    const payload = this.createPayload(method, params);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(id);
      const data = await res.json();
      return data.result as T;
    } catch (err) {
      throw new Error(`rpc request failed: ${(err as Error).message}`);
    }
  }

  public getBlockNumber(): Promise<number> {
    return this.request('eth_blockNumber', []);
  }

  public getBalance(address: string): Promise<string> {
    return this.request('eth_getBalance', [address, 'latest']);
  }

  public setTimeout(ms: number): void {
    this.timeout = ms;
  }
}
