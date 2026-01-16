import assert from "node:assert";
import { describe, it } from "node:test";
import { parseGroup } from "../core";

describe("Parser", () => {
  describe("#group", () => {
    it('should return array with key "id"', () => {
      const result = parseGroup({ group: "id" });

      assert.ok(Array.isArray(result), "Result should be an array");
      assert.ok(result?.length === 1, "Result should have 1 element");
      assert.ok(typeof result[0] === "string", "Result key [0] should be a string");
      assert.ok(result[0] === "id", "Result key [0] should be 'id'");
    });

    it('should return array with keys "id" and "created_at"', () => {
      const result = parseGroup({ group: "id,created_at" });

      assert.ok(Array.isArray(result), "Result should be an array");
      assert.ok(result?.length === 2, "Result should have 2 elements");
      assert.ok(typeof result[0] === "string", "Result key [0] should be a string");
      assert.ok(result[0] === "id", "Result key [0] should be 'id'");
      assert.ok(typeof result[1] === "string", "Result key [1] should be a string");
      assert.ok(result[1] === "created_at", "Result key [1] should be 'created_at'");
    });

    it("should return undefined when group is not provided", () => {
      const result = parseGroup({});

      assert.ok(result == undefined, "Result should be undefined");
    });
  });
});
