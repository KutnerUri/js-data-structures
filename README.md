# Data Structures

This repository is a collection of data structures implemented in JavaScript, featuring a Heap and a Red-Black Binary Search Tree. It is akin to a training ground, much like a martial artist honing their skills—not for immediate conflict but for mastery over their craft.

## Installation

To set up the project, simply run:

```
bun install
```

Note: This project does not come with a startup script. Its primary focus is on the implementation of the data structures.

## Project Overview

The `Heap` is implemented with the intricacies of maintaining a tree-like structure within a one-dimensional array, accompanied by re-balancing algorithms.

The `Red-Black Binary Search Tree` is a more challenging structure, with rebalancing logic for insertions and deletions, which is often under-documented. This implementation has been rigorously tested with random insert-delete scenarios to ensure its robustness.

### Testing

Development was driven by tests, starting with test scenarios before actual implementation. To run the tests:

```
bun test
```

### Usage

The data structures within this repository serve as a reference for those looking to implement similar structures in JavaScript. They are not packaged for production use, but rather for educational purposes.

## Contributions

Contributions are welcome. If you have improvements or suggestions, feel free to fork the repository, make your changes, and submit a pull request.

# Red black tree

A Red-Black Binary Search Tree is a type of self-balancing binary search tree. Each node in the tree contains an extra attribute for color (red or not red). The tree maintains its balance during insertions and deletions to ensure that the path from the root to the farthest leaf is no more than twice as long as the path from the root to the nearest leaf. This balance is maintained through a series of rotations and color changes.

The tree follows these properties:

- Every node is either red or black. (Root is always black, and leaves, or null nodes, are black)
- If a node is red, it cannot have red children.
- Every path from a node to its descendant leaves contains the same number of nodes, excluding red ones.
- (Conclusion) If a node has exactly one child, it must be red. (Because if it was not, sit lower than its non existing sibling, violating requirement 3)

These properties ensure that the tree remains approximately balanced, leading to `O(log n)` search times, making it efficient for operations like searching, insertion, and deletion.

## Insertion

Rebalancing a Red-Black Tree during insertion is a critical operation to maintain its properties, ensuring that the tree remains balanced for optimal search times. The introduction of a red node upon insertion is a strategic choice, minimizing immediate disruptions to the tree's structure. However, when a red node is introduced beneath a red parent, rebalancing becomes necessary to prevent consecutive red nodes, which is a violation of the tree's properties.

Here's how the rebalancing process is conducted:

**When uncle is red**: If the sibling of the new node's parent (the uncle) is also red, the solution is straightforward recoloring. The parent and uncle are painted black, and the grandparent becomes red. This adjustment may propagate the need for rebalancing up the tree, now focusing on the grandparent.

**Otherwise**: When the uncle is black or absent, rotations are employed to redistribute the tree's structure. The direction of the rotation—left or right—is contingent upon the alignment of the new node with its parent and grandparent.

- **Triangle Configuration**: If the new node and its parent are not aligned (forming a 'triangle'), a preliminary rotation on the parent converts the configuration into a 'line'.

  ```plaintext
  "LeftRight" triangle before rotation:

  G          G
   \          \
    P(R) -->  new(R)
   /            \
  new(R)         P(R)
  ```

- **Line Configuration**: Once in a 'line', a rotation on the grandparent ensures that the parent ascends to the grandparent's position, with a subsequent recoloring to adhere to the Red-Black properties.

  ```plaintext
  "LeftLeft" line after rotation:

       G
      /           P
     P    --->   / \
    /          new   G
  new
  ```

The root is always maintained as black to simplify to the Red-Black Tree rules. Through rotations and recoloring, the tree maintains its balance, preserving the longest path's length to within twice that of the shortest path, thus ensuring operational efficiency.

## Deletion

Certainly, here's the rebalance section of the README integrated with the visualizations for clarity:

## Deletion

The deletion procedure in a Red-Black Tree is slightly more complex than insertion due to the stringent balance requirements. First, let's tackle the simple cases:

1. **Red Leaf Node (No Children)**: A red leaf node can simply be removed without any further adjustments.
2. **Single Child**: If the node has only one child, the node itself must be black, and the child must be red (according to conclusion 4). Replace the node with its child and recolor it to black. The tree remains balanced.
3. **Two Children**: For a node with two children, find the in-order successor (the smallest node in the right subtree), replace the value of the current node with that of the successor, and then delete the successor node instead, which is guaranteed to have at most one child.

The only case left is deleting a black leaf node with no children. Rebalance is required and happens as follows:

1. **Sibling Red (Triangle Conversion)**:  
   Rotate the red sibling over the parent, recolor it black, and then recolor the parent red, resulting in a new structure ready for further adjustments.

   ```plaintext
       P                S(B)
     /   \             /    \
    C    S(R)  --->   P(R)   b
         /  \        / \
        a    b      C   a
   ```

2. **Sibling Black with Black Children (Propagation)**:
   When The sibling is black and both its children are red, we can move the imbalance up the tree.  
   Recolor the sibling red, and continue rebalancing from the parent.

   ```plaintext
       P               P
     /   \           /   \
    C    S(B)  ---> C    S(R)
           /  \          /  \
        [B]  [B]        B    B
   ```

3. **Black Sibling with Red Near Nephew (Triangle to Line Transformation)**:
   When the sibling is black with a red (near) child, rotate it for form a line, and continue to case 4.

   ```plaintext
       P                P
     /   \             / \
    C    S(B)    ---> C   N(B)
        /    \             \
        N(R)  B             S(R)
                             \
                              B
   ```

4. **Black Sibling with Red Far Nephew (Rebalancing Rotation)**:
   When encountering a "line" configuration, rotate the node to return the tree into balance.
   ```plaintext
      P(?)                 S(?)
     /    \               /   \
    C      S(B)   --->  P(B)   N(B)
          /   \        /  \
         ?     N(R)   C    ?
   ```

A comprehensive test suite ensures these cases are handled correctly, and the tree maintains its black-height balance across all paths, which is vital for maintaining the performance guarantees of the Red-Black Tree.  
See the code for more details.
