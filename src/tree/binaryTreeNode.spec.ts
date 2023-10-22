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
    it("should handle rotation when node is root, and has only right child", () => {
      //   a    -->     c
      //  / \          / \
      // b   c        a   f
      //    / \      / \
      //   d   f    b   d

      const a = new BinaryTreeNode(10);
      const b = new BinaryTreeNode(20);
      a.right = b;
      a.right.parent = a;

      const newRoot = a.rotateLeft();

      expect(newRoot).toBe(b);
      expect(newRoot.right).toBeUndefined();
      expect(newRoot.parent).toBeUndefined();

      const newLeft = newRoot.left;
      expect(newLeft).toBe(a);
      expect(newLeft?.left).toBeUndefined();
      expect(newLeft?.right).toBeUndefined();
      expect(newLeft?.parent).toBe(newRoot);
    });

    it("should throw error when no right child", () => {
      const node = new BinaryTreeNode(10);
      expect(() => node.rotateLeft()).toThrow(/without right child/);
    });

    it("should handle rotation with parent and both children", () => {
      // p            p
      //  \            \
      //   a    -->     c
      //  / \          / \
      // b   c        a   f
      //    / \      / \
      //   d   f    b   d

      const parent = new BinaryTreeNode(5);
      const a = new BinaryTreeNode(10);
      const b = new BinaryTreeNode(7);
      const c = new BinaryTreeNode(20);
      const d = new BinaryTreeNode(15);
      const f = new BinaryTreeNode(30);

      parent.right = a;
      a.left = b;
      a.right = c;
      a.parent = parent;
      b.parent = a;
      c.parent = a;
      c.left = d;
      c.right = f;
      d.parent = c;
      f.parent = c;

      const newNode = a.rotateLeft();
      expect(newNode).toBe(c);
      expect(newNode.parent).toBe(parent);

      const newLeft = newNode.left;
      expect(newLeft).toBe(a);
      expect(newLeft?.parent).toBe(newNode);
      expect(newLeft?.left).toBe(b);
      expect(b.parent).toBe(newLeft);
      expect(newLeft?.right).toBe(d);
      expect(d.parent).toBe(newLeft);

      const newRight = newNode.right;
      expect(newRight).toBe(f);
      expect(newRight?.parent).toBe(newNode);
    });

    it("should handle rotation when left child is missing", () => {
      // p            p
      //  \            \
      //   a    -->     c
      //    \          / \
      //     c        a   f
      //    / \        \
      //   d   f        d

      const parent = new BinaryTreeNode(5);
      const a = new BinaryTreeNode(10);
      const c = new BinaryTreeNode(20);
      const d = new BinaryTreeNode(15);
      const f = new BinaryTreeNode(30);

      parent.right = a;
      a.right = c;
      a.parent = parent;
      c.parent = a;
      c.left = d;
      c.right = f;
      d.parent = c;
      f.parent = c;

      const newNode = a.rotateLeft();
      expect(newNode).toBe(c);
      expect(newNode.parent).toBe(parent);

      const newLeft = newNode.left;
      expect(newLeft).toBe(a);
      expect(newLeft?.parent).toBe(c);
      expect(newLeft?.left).toBeUndefined();
      expect(newLeft?.right).toBe(d);

      const newRight = newNode.right;
      expect(newRight).toBe(f);
      expect(newRight?.parent).toBe(c);
    });

    it("should handle rotation when left grandchild is missing", () => {
      // p            p
      //  \            \
      //   a    -->     c
      //    \          / \
      //     c        a   f
      //      \
      //       f
      const parent = new BinaryTreeNode(5);
      const a = new BinaryTreeNode(10);
      const c = new BinaryTreeNode(20);
      const f = new BinaryTreeNode(30);

      parent.right = a;
      a.parent = parent;
      a.right = c;
      c.parent = a;
      c.right = f;
      f.parent = c;

      const newNode = a.rotateLeft();

      expect(newNode).toBe(c);
      expect(newNode.parent).toBe(parent);

      const newLeft = newNode.left;
      expect(newLeft).toBe(a);
      expect(newLeft?.parent).toBe(c);
      expect(newLeft?.left).toBeUndefined();
      expect(newLeft?.right).toBeUndefined();

      const newRight = newNode.right;
      expect(newRight).toBe(f);
      expect(newRight?.parent).toBe(c);

      expect(newRight?.right).toBeUndefined();
      expect(newRight?.left).toBeUndefined();
    });

    it("should handle rotation when right grandchild is missing", () => {
      // p            p
      //  \            \
      //   a    -->     c
      //    \          /
      //     c        a   
      //    /          \
      //   d            d

      const parent = new BinaryTreeNode(5);
      const a = new BinaryTreeNode(10);
      const c = new BinaryTreeNode(20);
      const d = new BinaryTreeNode(15);

      parent.right = a;
      a.parent = parent;
      a.right = c;
      c.parent = a;
      c.left = d;
      d.parent = c;

      const newNode = a.rotateLeft();

      expect(newNode).toBe(c);
      expect(newNode.parent).toBe(parent);
      expect(newNode.right).toBeUndefined();

      const newLeft = newNode.left;
      expect(newLeft).toBe(a);
      expect(newLeft?.parent).toBe(c);
      expect(newLeft?.left).toBeUndefined();
      expect(newLeft?.right).toBe(d);

      expect(d.parent).toBe(newLeft);
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
