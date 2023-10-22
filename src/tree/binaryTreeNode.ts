/**
 * Represents a node in a binary tree.
 * @template T The type of the value stored in the node.
 */
export class BinaryTreeNode<T> {
  /** The value stored in the node. */
  val: T;
  /** The parent node of this node. */
  parent?: this = undefined;
  /** The left child node of this node. */
  left?: this = undefined;
  /** The right child node of this node. */
  right?: this = undefined;

  /**
   * Creates a new instance of BinaryTreeNode.
   * @param val The value to be stored in the node.
   */
  constructor(val: T) {
    this.val = val;
  }

  /** Returns true if the node is a leaf node (i.e. has no children). */
  get isLeaf() {
    return !this.hasLeftChild && !this.hasRightChild;
  }

  /** Returns true if the node has a left child. */
  get hasLeftChild() {
    return this.left !== undefined;
  }

  /** Returns true if the node has a right child. */
  get hasRightChild() {
    return this.right !== undefined;
  }

  // override
  toString(): string {
    if (
      this.val !== null &&
      typeof this.val === "object" &&
      "toString" in this.val
    ) {
      return this.val.toString();
    }

    return String(this.val);
  }

  /**
   * Replaces a child node of this node with another node.
   * @param node The child node to be replaced.
   * @param next The node to replace the child node with.
   * @returns True if the child node was successfully replaced, false otherwise.
   */
  replaceChild(node: this, next?: this): boolean {
    if (this.left === node) {
      this.left = next;
      return true;
    }
    if (this.right === node) {
      this.right = next;
      return true;
    }

    if (next) next.parent = this;

    return false;
  }

  /**
   * Rotates the node left.
   * @returns The new root node.
   */
  rotateLeft() {
    const { parent, right } = this;
    const nextNode = right;
    if (!nextNode) throw new Error("tried to RotateLeft() without right child");

    this.parent = right;
    this.right = right.left;
    if (this.right) this.right.parent = this;

    parent?.replaceChild(this, right);
    right.parent = parent;
    right.left = this;

    return right;
  }

  /**
   * Rotates the node right.
   * @returns The new root node.
   */
  rotateRight() {
    const { parent, left } = this;
    const nextNode = left;
    if (!nextNode) throw new Error("tried to RotateRight() without left child");

    this.parent = left;
    this.left = left.right;
    if (this.left) this.left.parent = this;

    parent?.replaceChild(this, left);
    left.parent = parent;
    left.right = this;

    return left;
  }
}
