import { SmartContractBase } from './SmartContractBase';

export interface NFTItem {
  tokenId: string;
  owner: string;
  metadata: string;
  mintTime: number;
}

export class NFTContract extends SmartContractBase {
  private nfts: Map<string, NFTItem>;
  private ownership: Map<string, string[]>;

  constructor(owner: string) {
    super(owner);
    this.nfts = new Map();
    this.ownership = new Map();
  }

  public mintNFT(owner: string, metadata: string): NFTItem {
    const tokenId = `nft_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const nft: NFTItem = {
      tokenId,
      owner,
      metadata,
      mintTime: Date.now()
    };

    this.nfts.set(tokenId, nft);
    const list = this.ownership.get(owner) || [];
    list.push(tokenId);
    this.ownership.set(owner, list);
    return nft;
  }

  public transferNFT(from: string, to: string, tokenId: string): boolean {
    const nft = this.nfts.get(tokenId);
    if (!nft || nft.owner !== from) return false;

    nft.owner = to;
    this.nfts.set(tokenId, nft);

    const fromList = this.ownership.get(from) || [];
    this.ownership.set(from, fromList.filter(id => id !== tokenId));

    const toList = this.ownership.get(to) || [];
    toList.push(tokenId);
    this.ownership.set(to, toList);
    return true;
  }

  public getNFT(tokenId: string): NFTItem | null {
    return this.nfts.get(tokenId) || null;
  }

  public listUserNFTs(owner: string): NFTItem[] {
    const ids = this.ownership.get(owner) || [];
    return ids.map(id => this.nfts.get(id)!);
  }

  public execute(method: string, params: any[]): any {
    switch (method) {
      case 'mint': return this.mintNFT(params[0], params[1]);
      case 'transfer': return this.transferNFT(params[0], params[1], params[2]);
      case 'get': return this.getNFT(params[0]);
      case 'list': return this.listUserNFTs(params[0]);
      default: throw new Error('invalid method');
    }
  }
}
