import {
  BinarySearchTree,
  BinaryTreeNode,
  getSibling,
  getUncle,
  leftestChild,
  transplant,
} from "../tree";

/**
 * Represents a node in a Red-Black Tree.
 * @template T The type of value stored in the node.
 */
export class RedBlackTreeNode<T> extends BinaryTreeNode<T> {
  /**
   * is a red node
   */
  isRed: boolean = true;

  override toString(): string {
    return `${this.isRed ? "R" : ""}${super.toString()}`;
  }
}

export class RedBlackTree<
  T,
  Node extends RedBlackTreeNode<T>
> extends BinarySearchTree<T, Node> {
  override root?: Node | undefined = undefined;

  protected override createNode(val: T): Node {
    return new RedBlackTreeNode(val) as Node;
  }

  override insert(val: T): Node {
    const node = this.createNode(val);
    super._insert(node);

    this._insertFixup(node);

    return node;
  }

  override delete(value: T): Node | undefined {
    const node = this.find(value) as Node;
    if (!node) return undefined;

    this.deleteNode(node);
    return node;
  }

  private deleteNode(node: Node) {
    const { left, right } = node;
    const numberOfChildren = (left ? 1 : 0) + (right ? 1 : 0);

    // leaf
    if (numberOfChildren === 0) {
      // black leaf, special rebalance
      if (!node.isRed) this._deleteFixup(node);

      transplant(this, node, undefined);
    }

    // when having a single child, node must be black, and child must be red
    if (numberOfChildren === 1) {
      const child = left ?? right!;
      child.isRed = false;

      transplant(this, node, child);
    }

    // inner-tree node, replace with successor, and delete successor instead
    if (numberOfChildren === 2) {
      const successor = leftestChild(node.right!);
      node.val = successor.val;
      this.deleteNode(successor);
    }
  }

  private _insertFixup(node: Node) {
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

  private _deleteFixup(node: Node) {
    // you are removing a black node with no children.
    // the removal decrements the black height on this side of the tree,
    // so we need to push this side down, bubbling up until we re-balance the tree.

    let current = node;

    // bubble re-balance until reaching a red node
    while (!!current.parent && !current.isRed) {
      const isLeft = current.parent?.left === current;
      let sibling = getSibling(current)!;

      // left case: (mirror for right case)
      //
      //     P                  S(B)
      //   /   \               /    \
      // C(B-) S(R)   --->   P(R)    b
      //       /  \          / \
      //      a    b      C(B)  a
      //
      // a must be black, because S is black,
      // will continue up the tree in case 2 or finish in case 3 or 4

      // case 1: sibling is red
      if (sibling.isRed) {
        sibling.isRed = false;
        const parent = current.parent!;
        parent.isRed = true;

        if (isLeft) this.rotateLeft(parent);
        else this.rotateRight(parent);
        // continue from the new location
      }

      // case 2: sibling is black, and both its children are black
      // we can transfer the imbalance to it, and continue up the tree

      //
      //     P                  P
      //   /   \               /  \
      // C(B-) S(B)   --->   C(B)  S(R)
      //       /  \               /   \
      //     (B)  (B)           (B)   (B)
      //
      else if (!sibling.left?.isRed && !sibling.right?.isRed) {
        sibling.isRed = true;
        current = current.parent;
      }

      // sibling is black, and one or more of its children is red
      else {
        // case 3: current and sibling is black, and its opposite nephew is also black
        // this is "triangle" case, we need to rotate it, and turn it into case 4

        // left case: (mirror for right case)
        //
        //     P                      P
        //   /   \                  /   \
        // C(B-) S(B)      --->   C(B-)  N(B)
        //       /  \                      \
        //      N(R) (B)                    S(R)
        //                                   \
        //                                    (B)

        if (
          (isLeft && !sibling.right?.isRed) ||
          (!isLeft && !sibling.left?.isRed)
        ) {
          const nephew = isLeft ? sibling.left! : sibling.right!;
          nephew.isRed = false;

          sibling.isRed = true;
          if (isLeft) this.rotateRight(sibling);
          else this.rotateLeft(sibling);

          // the "near" nephew is now the sibling
          sibling = nephew;
          // continue to case 4
        }

        // case 4: current is black, sibling is black, and the opposing Nephew is red
        // we can rotate the tree to push `current` down, re-balancing the tree
        //
        // left case: (mirror for right case)
        //
        //    P(?)                    S(?)
        //   /    \                  /   \
        // C(B-)  S(B)      --->    P(B)  N(B)
        //       /  \              / \
        //      ??   N(R)        C(B) ??
        //
        const parent = current.parent!;
        sibling.isRed = parent.isRed;
        parent.isRed = false;

        const opposingNephew = isLeft ? sibling.right : sibling.left;
        opposingNephew!.isRed = false;

        if (isLeft) this.rotateLeft(parent);
        else this.rotateRight(parent);

        // we fixed the imbalance, an current node is not red.
        return;
      }
    }

    current.isRed = false;
  }
}

function fixRotateColor<Node extends RedBlackTreeNode<any>>(node: Node): Node {
  let parent = node.parent!;
  const grandparent = parent.parent!;

  const isParentLeft = grandparent.left === parent;
  const isLeft = parent.left === node;

  // handle "triangles":

  // "LeftRight"
  // G          G
  //  \          \
  //   P(R) -->  new
  //  /            \
  // new(R)         P
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
