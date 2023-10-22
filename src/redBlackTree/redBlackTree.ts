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
  //   override override parent?: BinaryTreeNode<T> | undefined = undefined;

  override toString(): string {
    return `${this.isRed ? "R" : ""}${super.toString()}`;
  }
}

// TODO - type T

export class RedBlackTree<T extends number> extends BinarySearchTree<T> {
  override root?: RedBlackTreeNode<T> | undefined = undefined;

  override insert(val: T): BinaryTreeNode<T> {
    const node = new RedBlackTreeNode(val);
    super._insert(node);

    this._insertFixup(node);

    return node;
  }

  override delete(value: T): BinaryTreeNode<T> | undefined {
    const node = this.find(value) as RedBlackTreeNode<T>;
    if (!node) return undefined;

    this.deleteNode(node);
    return node;
  }

  private deleteNode(node: RedBlackTreeNode<T>) {
    const { left, right } = node;
    const numberOfChildren = (left ? 1 : 0) + (right ? 1 : 0);

    // leaf
    if (numberOfChildren === 0) {
      if (!node.isRed) this._deleteFixup(node);

      transplant(this, node, undefined);
    }

    // when having a single child, node must be black, and child must be red
    if (numberOfChildren === 1) {
      const child = left ?? right!;
      child.isRed = false;

      transplant(this, node, child);
    }

    if (numberOfChildren === 2) {
      const successor = leftestChild(node.right!);
      node.val = successor.val;
      this.deleteNode(successor);
    }
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
    // you are removing a black node with no children.
    // the removal decrements the black height on this side of the tree,
    // so we need to push this side down, bubbling up until we rebalance the tree.

    let current = node;

    // TODO - try to continue the loop after each case.
    // will simplify the if-s

    // bubble rebalance until reaching a red node
    while (!!current.parent && !current.isRed) {
      const isLeft = current.parent?.left === current;
      let sibling = getSibling(current)!;

      // case 1: sibling is red
      if (sibling.isRed) {
        sibling.isRed = false;
        const parent = current.parent!;
        parent.isRed = true;

        if (isLeft) parent.rotateLeft();
        else parent.rotateRight();

        // update sibling, continue to the next cases
        sibling = getSibling(current)!;
      }

      // case 2: sibling is black, and both its children are black
      // we can transfer the imbalance to it, and continue up the tree
      if (!sibling.isRed && !sibling.left?.isRed && !sibling.right?.isRed) {
        sibling.isRed = true;
        current = current.parent;

        continue;
      }

      if (!current.isRed && !sibling.isRed) {
        // this is "triangle" case, we need to rotate it to turn it into case 4
        // case 3: current and sibling is black, the sibling's opposing child is red, but the other is not

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
          (isLeft && sibling.left?.isRed && !sibling.right?.isRed) ||
          (!isLeft && sibling.right?.isRed && !sibling.left?.isRed)
        ) {
          sibling.isRed = true;

          if (isLeft) sibling.left!.isRed = false;
          else sibling.right!.isRed = false;

          if (isLeft) sibling.rotateRight();
          else sibling.rotateLeft();

          // continue to case 4
          sibling = getSibling(current)!;
        }

        // case 4: current is black, sibling is black, and the opposing Nephew is red
        // we can rotate the tree to push current down, and return the tree to balance.
        //
        // left case: (mirror for right case)
        //
        //    P(?)                   S(?)
        //   /    \                  /   \
        // C(B-)  S(B)      --->    P(B)  N(B)
        //       /  \              / \
        //      ??   N(R)        C(B) ??
        //
        const opposingNephew = isLeft ? sibling.right : sibling.left;
        if (opposingNephew?.isRed) {
          const parent = current.parent!;
          sibling.isRed = parent.isRed;
          parent.isRed = false;

          opposingNephew.isRed = false;

          if (isLeft) parent.rotateLeft();
          else parent.rotateRight();

          return; // we fixed the imbalance, an current node is not red.
        }
      }
    }

    current.isRed = false;
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
