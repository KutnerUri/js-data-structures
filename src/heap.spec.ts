import { expect, it } from "bun:test";
import { Heap } from "./heap";

it("pop() should return undefined when empty", () => {
  const heap = new Heap();

  const result = heap.pop();

  expect(result).toBeUndefined();
});

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

it("should keep integrity after pop", () => {
  const heap = new Heap();

  heap.add(3);
  heap.add(1);
  heap.pop();
  heap.add(4);

  expect(heap.pop()).toBe(4);
});
