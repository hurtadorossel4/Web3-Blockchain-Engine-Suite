import { ChainAPI } from './ChainAPI';
import { ChainMonitor } from './ChainMonitor';
import { PeerNetwork } from './PeerNetwork';

export class MainApplication {
  private api: ChainAPI;
  private monitor: ChainMonitor;
  private peerNetwork: PeerNetwork;
  public running: boolean;

  constructor() {
    this.api = new ChainAPI();
    this.monitor = new ChainMonitor();
    this.peerNetwork = new PeerNetwork();
    this.running = false;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.monitor.logBlock(0, this.api.getChain()[0].hash);
    console.log('blockchain application started');
  }

  public stop(): void {
    this.running = false;
    console.log('blockchain application stopped');
  }

  public createUserWallet() {
    const wallet = this.api.createWallet();
    this.monitor.logTransaction(wallet.address, 'success');
    return wallet;
  }

  public sendTransfer(from: string, to: string, amount: number, key: string) {
    const tx = this.api.createTransaction(from, to, amount);
    const signed = this.api.signTransaction(tx, key);
    this.api.mineBlock({ transaction: signed });
    this.monitor.logTransaction(`${from}-${to}`, 'success');
    return signed;
  }

  public getChainInfo() {
    return {
      height: this.api.getChain().length - 1,
      valid: this.api.validateChain(),
      peers: this.peerNetwork.getActivePeers().length
    };
  }
}

const app = new MainApplication();
app.start();
