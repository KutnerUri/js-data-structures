import { BinaryTreeNode } from "./binaryTreeNode";

/**
 * Represents a binary search tree.
 * @template T The type of values stored in the tree.
 */
export class BinarySearchTree<T extends number> {
  /**
   * The root node of the tree.
   */
  root?: BinaryTreeNode<T> = undefined;

  /**
   * Creates a new instance of the BinarySearchTree class.
   * @param compareFn A comparison function that returns true on equality. Defaults to (a, b) => a <= b.
   * @param eqFn An equality function. Defaults to (a, b) => compareFn(a, b) && compareFn(b, a).
   */
  constructor(
    public compareFn: (a: T, b: T) => boolean = (a, b) => a <= b,
    public eqFn: (a: T, b: T) => boolean = (a, b) =>
      compareFn(a, b) && compareFn(b, a)
  ) {}

  /**
   * Inserts a new value into the tree.
   * @param val The value to insert.
   * @returns The newly created node.
   */
  insert(val: T): BinaryTreeNode<T> {
    const node = new BinaryTreeNode(val);
    this._insert(node);
    return node;
  }

  protected _insert(node: BinaryTreeNode<T>) {
    if (!this.root) return (this.root = node);

    let current = this.root;
    while (true) {
      if (this.compareFn(current.val, node.val)) {
        if (!current.right) {
          node.parent = current;
          current.right = node;
          return node;
        }

        current = current.right;
      } else {
        if (!current.left) {
          node.parent = current;
          current.left = node;
          return node;
        }

        current = current.left;
      }
    }
  }

  /**
   * Deletes a node from the tree.
   * @param value The value to delete.
   * @returns The deleted node, or undefined if the value was not found.
   */
  delete(value: T): BinaryTreeNode<T> | undefined {
    const node = this.find(value);
    if (!node) return undefined;

    this._delete(node);
    return node;
  }

  /**
   * Deletes a node from the tree.
   * @param node The node to delete.
   * @returns The deleted node.
   * @private
   */
  private _delete(node: BinaryTreeNode<T>) {
    const { parent, left, right } = node;

    let nextNode: BinaryTreeNode<T> | undefined = undefined;
    if (!left && !right) {
      nextNode = undefined;
    } else if (!left) {
      nextNode = right;
    } else if (!right) {
      nextNode = left;
    } else {
      // has both left and right
      const replacement = leftestChild(right);
      node.val = replacement.val;

      // single recursion
      this._delete(replacement);
    }

    if (parent) {
      if (nextNode) nextNode.parent = parent;
      parent.replaceChild(node, nextNode);
    } else {
      if (nextNode) nextNode.parent = undefined;
      this.root = nextNode;
    }

    return node;
  }

  /**
   * Determines whether the tree contains a value.
   * @param value The value to search for.
   * @returns True if the value is found, false otherwise.
   */
  has(value: T) {
    return this.find(value) !== undefined;
  }

  /**
   * Finds a node in the tree.
   * @param value The value to search for.
   * @returns The node containing the value, or undefined if the value was not found.
   * @private
   */
  private find(value: T): BinaryTreeNode<T> | undefined {
    let current = this.root;

    while (current) {
      if (this.eqFn(current.val, value)) return current;

      if (this.compareFn(current.val, value)) {
        current = current.right;
      } else {
        current = current.left;
      }
    }

    return undefined;
  }

  toString(): string {
    return recToString(this.root!);
  }
}

function recToString(node?: BinaryTreeNode<number>): string {
  if (!node) return "";
  let result = node.toString();
  if (!node.left && !node.right) return result;

  return `${result}(${recToString(node.left)},${recToString(node.right)})`;
}

// utils

function leftestChild<T>(node: BinaryTreeNode<T>) {
  let n = node;
  while (n.left !== undefined) {
    n = n.left;
  }

  return n;
}

// example tree
//
//                        10
//          5                                 15
//   0             7                13                20
// -1    3      6    8          11      14       18         24

//
//           x
//      5           15
// 0       7     13     20
//
