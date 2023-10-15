import { describe, expect, it } from "bun:test";
import { RedBlackTree } from "./redBlackTree";

// rules
// every node is either red or black
// the root is always black
// leaves (null) are always black
// red nodes can't have red children
// "black height" is always the same - every path from root to leaves has the same number of black nodes
// new insertions are always red

describe("insertion", () => {
  it("should just insert into an empty tree", () => {
    const tree = new RedBlackTree();
    tree.insert(5);

    expect(tree.toString()).toBe("5");
  });

  it("should just insert into a tree with a root", () => {
    const tree = new RedBlackTree();
    tree.insert(5);
    tree.insert(3);

    expect(tree.toString()).toBe("5(R3,)");
  });

  it("should flip color when inserting a new red node to a red parent and a red uncle", () => {
    const tree = new RedBlackTree();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);

    // sanity:
    expect(tree.toString()).toBe("10(R5,R15)");

    tree.insert(7);

    expect(tree.toString()).toBe("10(5(,R7),15)");
  });

  it("should insert a new red node when having a red sibling", () => {
    const tree = new RedBlackTree();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(7);

    // sanity
    expect(tree.toString()).toBe("10(5(,R7),15)");

    tree.insert(3);

    expect(tree.toString()).toBe("10(5(R3,R7),15)");
  });

  it("should rotate when inserting a node onto a red node (RL)", () => {
    const tree = new RedBlackTree();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(7);

    // sanity
    expect(tree.toString()).toBe("10(5(,R7),15)");

    tree.insert(6);

    expect(tree.toString()).toBe("10(6(R5,R7),15)");
  });

  it("should rotate when inserting a node onto a red node (RR)", () => {
    const tree = new RedBlackTree();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(7);

    // sanity
    expect(tree.toString()).toBe("10(5(,R7),15)");

    tree.insert(8);

    expect(tree.toString()).toBe("10(7(R5,R8),15)");
  });

  it("should rotate when inserting a node onto a red node (LR)", () => {
    const tree = new RedBlackTree();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(3);

    // sanity
    expect(tree.toString()).toBe("10(5(R3,),15)");

    tree.insert(4);

    expect(tree.toString()).toBe("10(4(R3,R5),15)");
  });

  it("should rotate when inserting a node onto a red node (LL)", () => {
    const tree = new RedBlackTree();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(3);

    // sanity
    expect(tree.toString()).toBe("10(5(R3,),15)");

    tree.insert(2);

    expect(tree.toString()).toBe("10(3(R2,R5),15)");
  });
});

// insertion Tests
// Insert into an empty tree.
// Insert into a tree with only a root.
// Insert into a tree that requires color flip.
// Insert into a tree that requires rotations (single and double).
// Deletion Tests
// Delete a node from a tree with only a root.
// Delete a red node.
// Delete a black node with a red child.
// Delete a black node with no red child (this is the complicated case).
// Search Tests
// Search in an empty tree.
// Search for a node that exists.
// Search for a node that does not exist.
// Property Tests
// All paths from any node to its leaf nodes have the same number of black nodes.
// Red nodes have only black children.
// New insertions are always red.
// Traversal Tests
// In-order traversal returns a sorted list.
// Pre-order and post-order traversals are consistent with the structure.
// Boundary Tests
// Insert the maximum and minimum allowable keys.
// Delete the root.
// Delete all nodes to empty the tree.
// Complex Operations
// Bulk insertions maintaining RB properties.
// Bulk deletions maintaining RB properties.
// Serialization Tests
// Serialize and deserialize an empty tree.
// Serialize and deserialize a complex tree, verifying RB properties hold.
// Miscellaneous
// Verify that the tree height is logarithmic in the number of nodes.
