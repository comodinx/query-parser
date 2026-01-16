import assert from "node:assert";
import { describe, it } from "node:test";
import { parseOrder } from "../core";

describe("Parser", () => {
  describe("#order", () => {
    it('should return array with key "id" and undefined order direction', () => {
      const result = parseOrder({ order: "id" });

      assert.ok(Array.isArray(result), "Result should be an array");
      assert.ok(result?.length === 1, "Result should have 1 element");
      assert.ok(Array.isArray(result[0]), "Result [0] should be an array");
      assert.ok(typeof result[0][0] === "string", "Result [0][0] should be a string");
      assert.ok(result[0][0] === "id", "Result [0][0] should be 'id'");
      assert.ok(result[0][1] == null, "Result [0][1] should be an undefined");
    });

    it('should return array with key "id" and "DESC" order direction', () => {
      const result = parseOrder({ order: "id-DESC" });

      assert.ok(Array.isArray(result), "Result should be an array");
      assert.ok(result?.length === 1, "Result should have 1 element");
      assert.ok(Array.isArray(result[0]), "Result [0] should be an array");
      assert.ok(typeof result[0][0] === "string", "Result [0][0] should be a string");
      assert.ok(result[0][0] === "id", "Result [0][0] should be 'id'");
      assert.ok(typeof result[0][1] === "string", "Result [0][1] should be a string");
      assert.ok(result[0][1] === "DESC", "Result [0][1] should be 'DESC'");
    });

    it('should return array with keys "id" and "created_at" with "DESC" and "ASC" order directions', () => {
      const result = parseOrder({ order: "id-DESC,created_at-ASC" });

      assert.ok(Array.isArray(result), "Result should be an array");
      assert.ok(result?.length === 2, "Result should have 1 element");
      assert.ok(Array.isArray(result[0]), "Result [0] should be an array");
      assert.ok(typeof result[0][0] === "string", "Result [0][0] should be a string");
      assert.ok(result[0][0] === "id", "Result [0][0] should be 'id'");
      assert.ok(typeof result[0][1] === "string", "Result [0][1] should be a string");
      assert.ok(result[0][1] === "DESC", "Result [0][1] should be 'DESC'");
      assert.ok(Array.isArray(result[1]), "Result [1] should be an array");
      assert.ok(typeof result[1][0] === "string", "Result [1][0] should be a string");
      assert.ok(result[1][0] === "created_at", "Result [1][0] should be 'created_at'");
      assert.ok(typeof result[1][1] === "string", "Result [1][1] should be a string");
      assert.ok(result[1][1] === "ASC", "Result [1][1] should be 'ASC'");
    });

    it("should return undefined when group is not provided", () => {
      const result = parseOrder({});

      assert.ok(result == undefined, "Result should be undefined");
    });
  });
});
