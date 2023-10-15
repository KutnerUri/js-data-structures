type Index = number;

export class Heap<T> {
  store: T[] = [];

  constructor(public readonly compareFn: (a: T, b: T) => boolean) {}

  static maxHeap(): Heap<number> {
    return new Heap((a, b) => a < b);
  }
  static minHeap(): Heap<number> {
    return new Heap((a, b) => a > b);
  }

  get size() {
    return this.store.length;
  }

  get empty(): boolean {
    return this.size === 0;
  }

  add(...items: T[]) {
    items.forEach((item) => this._add(item));
  }

  private _add(item: T) {
    this.store.push(item);
    const newIdx = this.size - 1;

    this.balanceUp(newIdx);
  }

  peek(): T | undefined {
    if (this.size < 1) return undefined;
    return this.get(0);
  }

  pop(): T | undefined {
    if (this.size === 0) return undefined;
    if (this.size === 1) return this.store.pop();

    const root = this.get(0);
    const lastVal = this.store.pop()!;

    this.set(0, lastVal);

    this.balanceDown(0);

    return root;
  }

  private balanceUp(index: Index) {
    let currentIdx = index;
    let parentIdx = this.toParent(currentIdx);

    while (parentIdx > -1) {
      const current = this.get(currentIdx);
      const parent = this.get(parentIdx);

      if (!this.compareFn(parent, current)) return;

      this.swap(parentIdx, currentIdx);

      currentIdx = parentIdx;
      parentIdx = this.toParent(currentIdx);
    }
  }

  private balanceDown(index: Index) {
    let current = index;

    while (true) {
      const [leftIdx, rightIdx] = [
        this.toLeftChild(current),
        this.toRightChild(current),
      ];

      const [hasLeftChild, hasRightChild] = [leftIdx > -1, rightIdx > -1];

      let nextRoot = current;
      if (hasLeftChild && this.compareFn(this.get(current), this.get(leftIdx)))
        nextRoot = leftIdx;
      if (
        hasRightChild &&
        this.compareFn(this.get(nextRoot), this.get(rightIdx))
      )
        nextRoot = rightIdx;

      if (current === nextRoot) return; // is balanced, or is leaf
      this.swap(current, nextRoot);

      current = nextRoot;
    }
  }

  private get(index: Index): T {
    if (index < 0) throw new Error(`heap: out of bounds (${index})`);
    if (index >= this.store.length)
      throw new Error(`heap: out of bounds (${index})`);
    return this.store[index];
  }

  private set(index: Index, val: T) {
    if (index < 0 || index >= this.size) throw new Error("heap: out of bounds");

    this.store[index] = val;
  }

  private swap(aIdx: Index, bIdx: Index) {
    const valA = this.store[aIdx];
    const valB = this.store[bIdx];

    this.store[aIdx] = valB;
    this.store[bIdx] = valA;
  }

  private toLeftChild(index: Index): Index {
    const childIdx = index * 2 + 1;
    if (childIdx >= this.size) return -1;

    return childIdx;
  }

  private toRightChild(index: Index): Index {
    const childIdx = index * 2 + 2;
    if (childIdx >= this.size) return -1;

    return childIdx;
  }

  private toParent(index: Index): Index {
    if (index <= 0) return -1;
    return Math.floor(index / 2);
  }
}
