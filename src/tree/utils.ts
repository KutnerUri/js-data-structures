import { BinarySearchTree } from "./binaryTree";
import { BinaryTreeNode } from "./binaryTreeNode";

export function getUncle<T, Node extends BinaryTreeNode<T>>(
  node: Node
): Node | undefined {
  const parent = node.parent;
  if (!parent) return undefined;

  const grandparent = parent.parent;
  if (!grandparent) return undefined;

  const isParentLeft = grandparent.left === parent;
  return isParentLeft ? grandparent.right : grandparent.left;
}

export function getSibling<T, Node extends BinaryTreeNode<T>>(
  node: Node
): Node | undefined {
  const { parent } = node;
  if (!parent) return undefined;

  return parent.left === node ? parent.right : parent.left;
}

/**
 * Drops `node` and replace it with `next`
 */
export function transplant(
  tree: BinarySearchTree<any>,
  node: BinaryTreeNode<any>,
  next?: BinaryTreeNode<any>
) {
  if (node.parent) {
    node.parent.replaceChild(node, next);
  } else {
    tree.root = next;
  }

  if (next) next.parent = node.parent;
} // utils

export function leftestChild<T, Node extends BinaryTreeNode<T>>(
  node: Node
): Node {
  let n = node;
  while (n.left !== undefined) {
    n = n.left;
  }

  return n;
}

export function count(node?: BinaryTreeNode<any>): number {
  if (!node) return 0;

  return 1 + count(node.left) + count(node.right);
}
