import { beforeEach, describe, expect, it } from "bun:test";
import { BinarySearchTree } from "./binaryTree";

describe("BinarySearchTree", () => {
  let tree: BinarySearchTree<number>;

  beforeEach(() => {
    tree = new BinarySearchTree<number>();
  });

  describe("insert", () => {
    it("should insert a value into an empty tree", () => {
      tree.insert(5);
      expect(tree.root?.val).toBe(5);
    });

    it("should insert a value into a non-empty tree", () => {
      tree.insert(5);
      tree.insert(3);
      expect(tree.root?.left?.val).toBe(3);
    });
  });

  describe("delete", () => {
    it("should delete a value from a tree", () => {
      tree.insert(5);
      tree.delete(5);
      expect(tree.root).toBeUndefined();
    });

    it("should delete a value from a tree with multiple nodes", () => {
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);
      tree.delete(3);
      expect(tree.root?.left?.val).toBeUndefined();
    });

    it("should return undefined if the value is not found", () => {
      expect(tree.delete(5)).toBeUndefined();
    });
  });

  describe("has", () => {
    it("should return true if the value is in the tree", () => {
      tree.insert(5);
      expect(tree.has(5)).toBe(true);
    });

    it("should return false if the value is not in the tree", () => {
      expect(tree.has(5)).toBe(false);
    });
  });
});
