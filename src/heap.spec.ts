import { expect, it } from "bun:test";
import { Heap } from "./heap";

it("should insert one item", () => {
  const heap = new Heap();
  heap.add(1);
  const popped = heap.pop();

  expect(popped).toBe(1);
});

it("should peek in order", () => {
  const heap = new Heap();
  heap.add(1);
  heap.add(3);
  heap.add(2);

  expect(heap.pop()).toBe(3);
  expect(heap.pop()).toBe(2);
  expect(heap.pop()).toBe(1);
  expect(heap.pop()).toBeUndefined();
});
