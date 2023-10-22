import { describe, expect, it } from "bun:test";
import { RedBlackTree } from "./redBlackTree";
import { validateRedBlackTree } from "./validate";
import { count } from "../tree";

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

  it("should fixup recursively up the tree", () => {
    const tree = new RedBlackTree();

    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(20);
    tree.insert(40);
    tree.insert(60);
    tree.insert(80);

    //        50(B)
    //       /      \
    //    30(B)    70(B)
    //   /   \    /    \
    // 20(R) 40(R) 60(R) 80(R)

    // sanity
    expect(tree.toString()).toBe("50(30(R20,R40),70(R60,R80))");

    tree.insert(35);
    //         50(B)
    //       /       \
    //    30(R)       70(B)
    //   /   \       /    \
    // 20(B) 40(B)  60(R) 80(R)
    //      /
    //    35(R)
    // sanity
    expect(tree.toString()).toBe("50(R30(20,40(R35,)),70(R60,R80))");

    tree.insert(32);
    //         50(B)                               50(B)
    //       /       \                          /       \
    //    30(R)       70(B)                  30(R)       70(B)
    //   /   \       /    \                 /   \       /    \
    // 20(B) 40(B)  60(R) 80(R)   --->   20(B) 35(B)  60(R) 80(R)
    //      /                                   / \
    //    35(R)                            32(R)   40(R)
    //    /
    //  32(R)
    expect(tree.toString()).toBe("50(R30(20,35(R32,R40)),70(R60,R80))");

    tree.insert(45);

    //           50(B)                        50(B)                          50(B)                       35B
    //        /       \                     /       \                      /       \                   /     \
    //     30(R)       70(B)             30(R)       70(B)              35(B)       70(B)            30R     50R
    //    /   \       /    \            /   \       /    \             /   \       /    \           /   \     / \
    // 20(B) 35(B)  60(R) 80(R) ---> 20(B) 35(R)  60(R) 80(R) --->  30(R) 40(R)  60(R) 80(R) ---> 20    32  40   70
    //        / \                           / \                     / \      \                               \   / \
    //   32(R)   40(R)                 32(B)   40(B)            20(B) 32(B)   45(R)                         45R 60R 80R
    //            \                             \
    //             45(R)                         45(R)

    expect(tree.toString()).toBe("35(R30(20,32),R50(40(,R45),70(R60,R80)))");
  });

  describe("random tree", () => {
    it("should always be a valid red black tree, when inserting only", () => {
      const tree = new RedBlackTree();

      for (let i = 0; i < 1000; i++) {
        const value = Math.floor(Math.random() * 100);

        tree.insert(value);
        expect(tree.has(value)).toBeTrue();

        expect(validateRedBlackTree(tree.root)).toBeTrue();
      }
    });

    it("should always be a valid red black tree, when inserting and deleting", () => {
      const tree = new RedBlackTree();
      let numberOfNodes = 0;

      for (let i = 0; i < 10000; i++) {
        const value = Math.floor(Math.random() * 500);

        if (tree.has(value)) {
          tree.delete(value);
          numberOfNodes -= 1;
          expect(tree.has(value)).toBeFalse();
          expect(count(tree.root)).toBe(numberOfNodes);
        } else {
          tree.insert(value);
          numberOfNodes += 1;
          expect(tree.has(value)).toBeTrue();
          expect(count(tree.root)).toBe(numberOfNodes);
        }

        // expect(tree.root).toSatisfy(validateRedBlackTree);
        expect(validateRedBlackTree(tree.root)).toBeTrue();
      }
    });
  });

  describe("deletion", () => {
    it("should do nothing when tree is empty", () => {
      const tree = new RedBlackTree();

      const result = tree.delete(5);

      expect(result).toBeUndefined();
      expect(tree.toString()).toBe("");
    });

    it("should empty tree when has only the root", () => {
      const tree = new RedBlackTree();
      tree.insert(5);

      const result = tree.delete(5);

      expect(result?.val).toBe(5);
      expect(tree.toString()).toBe("");
    });

    it("should just remove node when deleting a red leaf node", () => {
      const tree = new RedBlackTree();
      tree.insert(5);
      tree.insert(3);
      tree.insert(7);

      const result = tree.delete(3);

      expect(result?.val).toBe(3);
      expect(tree.toString()).toBe("5(,R7)");
    });

    it("should replace with child when deleting a black node with a red child", () => {
      const tree = new RedBlackTree();
      tree.insert(5);
      tree.insert(3);
      tree.insert(1);
      tree.insert(4);

      // sanity
      expect(tree.toString()).toBe("3(1,5(R4,))");

      tree.delete(5);

      expect(tree.toString()).toBe("3(1,4)");
    });

    it("should replace with successor and remove it, when deleting an inner black node (red successor)", () => {
      const tree = new RedBlackTree();

      tree.insert(5);
      tree.insert(3);
      tree.insert(1);
      tree.insert(4);

      // sanity
      expect(tree.toString()).toBe("3(1,5(R4,))");

      tree.delete(3);

      expect(tree.toString()).toBe("4(1,5)");
    });

    it("should replace success and re-balance, when deleting an inner black node (black successor)", () => {
      const tree = new RedBlackTree();

      tree.insert(5);
      tree.insert(3);
      tree.insert(1);
      tree.insert(6);

      // sanity
      expect(tree.toString()).toBe("3(1,5(,R6))");

      tree.delete(3);

      expect(tree.toString()).toBe("5(1,6)");
    });

    it("should replace with successor and remove it, when deleting root (red leaf successor)", () => {
      const tree = new RedBlackTree();

      tree.insert(5);
      tree.insert(3);
      tree.insert(1);
      tree.insert(4);
      tree.insert(6);

      // sanity
      expect(tree.toString()).toBe("3(1,5(R4,R6))");

      tree.delete(3);

      expect(tree.toString()).toBe("4(1,5(,R6))");
    });

    it("should rebalance when deleting a black leaf with a red sibling (case 1, then 3,4)", () => {
      const tree = new RedBlackTree();

      tree.insert(5);
      tree.insert(2);
      tree.insert(7);
      tree.insert(1);
      tree.insert(3);
      tree.insert(4);

      expect(tree.toString()).toBe("5(R2(1,3(,R4)),7)");

      tree.delete(7);

      expect(tree.toString()).toBe("2(1,R4(3,5))");
    });

    it("should rebalance when deleting a black leaf, with a black sibling having red children (case 4)", () => {
      const tree = new RedBlackTree();

      tree.insert(5);
      tree.insert(3);
      tree.insert(6);
      tree.insert(1);
      tree.insert(4);
      tree.insert(7);
      tree.delete(7);

      expect(tree.toString()).toBe("5(3(R1,R4),6)");

      tree.delete(6);

      expect(tree.toString()).toBe("3(1,5(R4,))");
    });

    it("should rebalance when deleting a black leaf with a black sibling with black children (case 2)", () => {
      const tree = new RedBlackTree();

      tree.insert(10);
      tree.insert(9);
      tree.insert(8);
      tree.insert(7);
      tree.insert(6);
      tree.insert(5);
      tree.insert(4);
      tree.insert(3);

      // sanity
      expect(tree.toString()).toBe("7(R5(4(R3,),6),R9(8,10))");

      tree.delete(10);

      expect(tree.toString()).toBe("7(R5(4(R3,),6),9(R8,))");
    });
  });
});
