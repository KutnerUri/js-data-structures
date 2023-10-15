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
