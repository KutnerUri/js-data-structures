import { describe, expect, it } from "bun:test";
import { BinaryTreeNode } from "./binaryTreeNode";

describe("BinaryTreeNode", () => {
  it("should create a new instance with the correct value", () => {
    const node = new BinaryTreeNode(42);
    expect(node.val).toBe(42);
  });

  it("should correctly identify a leaf node", () => {
    const node = new BinaryTreeNode(42);
    expect(node.isLeaf).toBe(true);
    node.left = new BinaryTreeNode(1);
    expect(node.isLeaf).toBe(false);
  });

  it("should correctly identify a node with a left child", () => {
    const node = new BinaryTreeNode(42);
    expect(node.hasLeftChild).toBe(false);
    node.left = new BinaryTreeNode(1);
    expect(node.hasLeftChild).toBe(true);
  });

  it("should correctly identify a node with a right child", () => {
    const node = new BinaryTreeNode(42);
    expect(node.hasRightChild).toBe(false);
    node.right = new BinaryTreeNode(1);
    expect(node.hasRightChild).toBe(true);
  });

  it("should correctly replace a child node", () => {
    const node = new BinaryTreeNode(42);
    const left = new BinaryTreeNode(1);
    const right = new BinaryTreeNode(2);
    node.left = left;
    node.right = right;

    expect(node.replaceChild(left, new BinaryTreeNode(3))).toBe(true);
    expect(node.left?.val).toBe(3);

    expect(node.replaceChild(right, undefined)).toBe(true);
    expect(node.right).toBeUndefined();
  });

  describe("rotateLeft()", () => {
    it("should handle rotation when node is root", () => {
      const root = new BinaryTreeNode(10);
      root.right = new BinaryTreeNode(20);
      root.rotateLeft();
      expect(root.parent?.val).toBe(20);
      expect(root.parent?.left?.val).toBe(10);
    });

    it("should throw error when no right child", () => {
      const node = new BinaryTreeNode(10);
      expect(() => node.rotateLeft()).toThrow(/without right child/);
    });

    it("should handle rotation with parent and both children", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(10);
      const left = new BinaryTreeNode(7);
      const right = new BinaryTreeNode(20);
      parent.right = node;
      node.left = left;
      node.right = right;
      node.parent = parent;

      node.rotateLeft();

      expect(node.parent?.val).toBe(20);
      expect(right.left?.val).toBe(10);
      expect(parent.right?.val).toBe(20);
    });

    it("should handle rotation with parent but no left child", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(10);
      const right = new BinaryTreeNode(20);
      parent.right = node;
      node.right = right;
      node.parent = parent;

      node.rotateLeft();

      expect(node.parent?.val).toBe(20);
      expect(right.left?.val).toBe(10);
      expect(parent.right?.val).toBe(20);
    });

    it("should handle rotation when right child has a left child", () => {
      const node = new BinaryTreeNode(10);
      const right = new BinaryTreeNode(20);
      const rightLeft = new BinaryTreeNode(15);
      node.right = right;
      right.left = rightLeft;

      node.rotateLeft();

      expect(node.right?.val).toBe(15);
      expect(right.left?.val).toBe(10);
      expect(node.parent?.val).toBe(20);
    });

    it("should handle rotation when right child has no left child", () => {
      const node = new BinaryTreeNode(10);
      const right = new BinaryTreeNode(20);
      node.right = right;

      node.rotateLeft();

      expect(node.right).toBeUndefined;
      expect(right.left?.val).toBe(10);
      expect(node.parent?.val).toBe(20);
    });

    it("should handle rotation when node is left child of parent", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(10);
      const right = new BinaryTreeNode(20);
      parent.left = node;
      node.parent = parent;
      node.right = right;

      node.rotateLeft();

      expect(node.parent?.val).toBe(20);
      expect(right.left?.val).toBe(10);
      expect(parent.left?.val).toBe(20);
    });

    it("should handle rotation when node is right child of parent", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(10);
      const right = new BinaryTreeNode(20);
      parent.right = node;
      node.parent = parent;
      node.right = right;

      node.rotateLeft();

      expect(node.parent?.val).toBe(20);
      expect(right.left?.val).toBe(10);
      expect(parent.right?.val).toBe(20);
    });
  });

  describe("rotateRight()", () => {
    it("should handle rotation when node is root", () => {
      const root = new BinaryTreeNode(20);
      root.left = new BinaryTreeNode(10);
      root.rotateRight();
      expect(root.parent?.val).toBe(10);
      expect(root.parent?.right?.val).toBe(20);
    });

    it("should throw error when no left child", () => {
      const node = new BinaryTreeNode(20);
      expect(() => node.rotateRight()).toThrow(/without left child/);
    });

    it("should handle rotation with parent and both children", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(20);
      const left = new BinaryTreeNode(10);
      const right = new BinaryTreeNode(30);
      parent.left = node;
      node.left = left;
      node.right = right;
      node.parent = parent;

      node.rotateRight();

      expect(node.parent?.val).toBe(10);
      expect(left.right?.val).toBe(20);
      expect(parent.left?.val).toBe(10);
    });

    it("should handle rotation with parent but no right child", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(20);
      const left = new BinaryTreeNode(10);
      parent.left = node;
      node.left = left;
      node.parent = parent;

      node.rotateRight();

      expect(node.parent?.val).toBe(10);
      expect(left.right?.val).toBe(20);
      expect(parent.left?.val).toBe(10);
    });

    it("should handle rotation when left child has a right child", () => {
      const node = new BinaryTreeNode(20);
      const left = new BinaryTreeNode(10);
      const leftRight = new BinaryTreeNode(15);
      node.left = left;
      left.right = leftRight;

      node.rotateRight();

      expect(node.left?.val).toBe(15);
      expect(left.right?.val).toBe(20);
      expect(node.parent?.val).toBe(10);
    });

    it("should handle rotation when left child has no right child", () => {
      const node = new BinaryTreeNode(20);
      const left = new BinaryTreeNode(10);
      node.left = left;

      node.rotateRight();

      expect(node.left).toBeUndefined;
      expect(left.right?.val).toBe(20);
      expect(node.parent?.val).toBe(10);
    });

    it("should handle rotation when node is left child of parent", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(20);
      const left = new BinaryTreeNode(10);
      parent.left = node;
      node.parent = parent;
      node.left = left;

      node.rotateRight();

      expect(node.parent?.val).toBe(10);
      expect(left.right?.val).toBe(20);
      expect(parent.left?.val).toBe(10);
    });

    it("should handle rotation when node is right child of parent", () => {
      const parent = new BinaryTreeNode(5);
      const node = new BinaryTreeNode(20);
      const left = new BinaryTreeNode(10);
      parent.right = node;
      node.parent = parent;
      node.left = left;

      node.rotateRight();

      expect(node.parent?.val).toBe(10);
      expect(left.right?.val).toBe(20);
      expect(parent.right?.val).toBe(10);
    });
  });
});
