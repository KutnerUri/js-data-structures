import { BinarySearchTree, BinaryTreeNode, getUncle } from "../tree";

/**
 * Represents a node in a Red-Black Tree.
 * @template T The type of value stored in the node.
 */
export class RedBlackTreeNode<T> extends BinaryTreeNode<T> {
  /**
   * is a red node
   */
  isRed: boolean = true;
  //   override override parent?: BinaryTreeNode<T> | undefined = undefined;

  override toString(): string {
    return `${this.isRed ? "R" : ""}${super.toString()}`;
  }
}

export class RedBlackTree<T> extends BinarySearchTree<T> {
  override root?: RedBlackTreeNode<T> | undefined = undefined;

  override insert(val: T): BinaryTreeNode<T> {
    const node = new RedBlackTreeNode(val);
    super._insert(node);

    this._insertFixup(node);

    return node;
  }

  override delete(val: T): BinaryTreeNode<T> | undefined {
    const node = super.delete(val) as RedBlackTreeNode<T> | undefined;

    if (node) this._deleteFixup(node);

    return node;
  }

  private _insertFixup(node: RedBlackTreeNode<T>) {
    while (node.isRed && node.parent?.isRed) {
      // grandparent has to exist, because parent is red
      let grandparent = node.parent.parent!;
      const uncle = getUncle(node);

      if (uncle?.isRed) {
        node.parent.isRed = false;
        uncle.isRed = false;

        grandparent.isRed = true;
      } else {
        const shouldUpdateRoot = grandparent === this.root;

        grandparent = fixRotateColor(node);
        if (shouldUpdateRoot) this.root = grandparent;
      }

      node = grandparent;
    }

    if (this.root?.isRed) this.root.isRed = false;
  }

  private _deleteFixup(node: RedBlackTreeNode<T>) {
    // throw new Error("Method not implemented.");
  }
}

function fixRotateColor(node: RedBlackTreeNode<any>) {
  let parent = node.parent!;
  const grandparent = parent.parent!;

  const isParentLeft = grandparent.left === parent;
  const isLeft = parent.left === node;

  // handle "triangles":

  // "LeftRight"
  // G            G
  //  \            \
  //   P(R) -->   new
  //  /              \
  // new(R )          P
  if (isParentLeft && !isLeft) {
    parent.rotateLeft();
    parent = node;
  }

  // "RightLeft"
  //   G             G
  //  /             /
  // P     -->    new
  //  \           /
  //   new       P
  if (!isParentLeft && isLeft) {
    parent.rotateRight();
    parent = node;
  }

  // handle "lines":
  swapColors(grandparent, parent);

  // "LeftLeft"
  //      G
  //     /           P
  //    P    --->   / \
  //   /          new   G
  // new
  //
  if (isParentLeft) return grandparent.rotateRight();
  //
  // "RightRight"
  // G
  //  \            P
  //   P   --->   / \
  //    \        G  new
  //    new
  else return grandparent.rotateLeft();
}

function swapColors(a: RedBlackTreeNode<any>, b: RedBlackTreeNode<any>) {
  const temp = a.isRed;
  a.isRed = b.isRed;
  b.isRed = temp;
}
