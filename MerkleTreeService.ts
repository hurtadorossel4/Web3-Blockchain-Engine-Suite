import { createHash } from 'crypto';

export class MerkleTreeService {
  private leaves: string[];
  private layers: string[][];

  constructor(data: any[]) {
    this.leaves = data.map(item => this.hash(JSON.stringify(item)));
    this.layers = [];
    this.buildTree();
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private buildTree(): void {
    this.layers = [this.leaves];
    let currentLayer = this.leaves;

    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        nextLayer.push(this.hash(left + right));
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  public getRoot(): string {
    return this.layers.length > 0 ? this.layers[this.layers.length - 1][0] : '';
  }

  public getProof(index: number): string[] {
    const proof: string[] = [];
    let currentIndex = index;

    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i];
      const isRight = currentIndex % 2 === 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      }
      currentIndex = Math.floor(currentIndex / 2);
    }
    return proof;
  }

  public verify(leaf: string, proof: string[], root: string): boolean {
    let hash = this.hash(leaf);
    for (const p of proof) {
      hash = this.hash(hash + p);
    }
    return hash === root;
  }
}
