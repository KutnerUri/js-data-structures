import { RedBlackTreeNode } from "./redBlackTree";

// rules:
// - every node is either red or black
// - root and leaves are always black
// - red nodes can't have red children
// - "black height" must always be same - every path from root to leaves has the same number of black nodes
// - new insertions are red

export function validateRedBlackTree<T>(
  node?: RedBlackTreeNode<T>,
  compareFn: (a: T, b: T) => boolean = (a, b) => a <= b
): boolean {
  return (
    validateRedNodes(node) &&
    calcBlackHeight(node) !== -1 &&
    validateBinarySearchTree(node, compareFn)
  );
}

function calcBlackHeight(node?: RedBlackTreeNode<any>): number {
  if (!node) return 0;

  const leftHeight = calcBlackHeight(node.left);
  const rightHeight = calcBlackHeight(node.right);

  // invalid red-black tree
  if (leftHeight === -1 || rightHeight === -1) return -1;
  if (leftHeight !== rightHeight) return -1;

  return leftHeight + (node.isRed ? 0 : 1);
}

function validateRedNodes(node?: RedBlackTreeNode<any>): boolean {
  if (!node) return true;
  const isChildRed = node.left?.isRed || node.right?.isRed;
  if (node.isRed && isChildRed) return false;

  return validateRedNodes(node?.left) && validateRedNodes(node?.right);
}

function validateBinarySearchTree<T>(
  node?: RedBlackTreeNode<T>,
  compareFn: (a: T, b: T) => boolean = (a, b) => a <= b
): boolean {
  if (!node) return true;
  if (node.left && !compareFn(node.left.val, node.val)) return false;
  if (node.right && !compareFn(node.val, node.right.val)) return false;

  return true;
}
