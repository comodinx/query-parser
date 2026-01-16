import { isNumber, isObject } from "lodash";
import assert from "node:assert";
import { describe, it } from "node:test";
import { parsePagination } from "../core";

describe("Parser", () => {
  describe("#pagination", () => {
    it('should return object with keys "limit" and "offset"', () => {
      const result = parsePagination({ page: 1, pageSize: 10 });

      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, `Limit should be 10 [result: ${JSON.stringify(result)}]`);
      assert.ok(isNumber(result?.limit), "Limit should be a number");
      assert.ok(result?.offset === 0, `Offset should be 0 [result: ${JSON.stringify(result)}]`);
      assert.ok(isNumber(result?.offset), "Offset should be a number");
    });

    it('should return object with correct values for "limit" and "offset" when page is 2', () => {
      const result = parsePagination({ page: 2, pageSize: 10 });

      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, `Limit should be 10 [result: ${JSON.stringify(result)}]`);
      assert.ok(isNumber(result?.limit), "Limit should be a number");
      assert.ok(result?.offset === 10, `Offset should be 10  [result: ${JSON.stringify(result)}]`);
      assert.ok(isNumber(result?.offset), "Offset should be a number");
    });

    it('should return object with keys "limit" and "offset" when page is not provided', () => {
      const result = parsePagination({ pageSize: 10 });

      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, `Limit should be 10 [result: ${JSON.stringify(result)}]`);
      assert.ok(isNumber(result?.limit), "Limit should be a number");
      assert.ok(result?.offset === 0, `Offset should be 0 [result: ${JSON.stringify(result)}]`);
      assert.ok(isNumber(result?.offset), "Offset should be a number");
    });

    it("should return undefined when page size is not provided", () => {
      const result = parsePagination({ page: 1 });

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when page and page size are not provided", () => {
      const result = parsePagination({});

      assert.ok(result == undefined, "Result should be undefined");
    });
  });
});
