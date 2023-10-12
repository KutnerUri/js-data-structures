type T = number; // WIP;
type Index = number;

// TODO - use compare function

export class Heap {
  store: T[] = [];

  constructor() {} // public compareFn: (a: T, b: T) => T

  get size() {
    return this.store.length;
  }

  add(item: T) {
    this.store.push(item);
    const newIdx = this.size - 1;

    this.balanceUp(newIdx);

    this.store.push(item);
  }

  peek(): T | undefined {
    if (this.size < 1) return undefined;
    if (this.size === 1) return this.get(0);

    const max = this.store.reduce((max, current) => Math.max(max, current));

    return max;
  }

  pop(): T | undefined {
    if (this.size < 1) return undefined;
    if (this.size === 0) return this.store.pop();

    const root = this.get(0);
    const lastVal = this.store.pop()!;

    this.set(0, lastVal);

    this.balanceDown(0);

    return root;
  }

  private balanceUp(index: Index) {
    let currentIdx = index;
    let parentIdx = this.toParent(index);

    while (parentIdx > -1) {
      const current = this.store[currentIdx];
      const parent = this.store[index];

      if (parent > current) return;

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
      if (hasLeftChild && this.get(leftIdx) < this.get(current))
        nextRoot = leftIdx;
      if (hasRightChild && this.get(nextRoot) < this.get(rightIdx))
        nextRoot = rightIdx;

      if (current === nextRoot) return; // is balanced, or is leaf
      this.swap(current, nextRoot);

      current = nextRoot;
    }
  }

  private get(index: Index): T {
    if (index < 0) throw new Error("heap: out of bounds");
    if (index >= this.store.length) throw new Error("heap: out of bounds");
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
    if (childIdx > this.size) return -1;

    return childIdx;
  }

  private toRightChild(index: Index): Index {
    const childIdx = index * 2 + 2;
    if (childIdx > this.size) return -1;

    return childIdx;
  }

  private toParent(index: Index): Index {
    if (index <= 0) return -1;
    return Math.floor(index / 2);
  }
}

// a heap:
//            50
//       45        30
// 40       20  25

//              0, 1,  2,  3,  4,  5
// array view: 50, 45, 30, 40, 20, 25

// "nodes": 0
//      1       2
//   3     4  5

// getting children:
// 3 = 1 * 2 + 1
// 5 = 2 * 2 + 1

// getting parents:
// 2 = 5 / 2 = 2.5
// 1 = 3 / 2 = 1
