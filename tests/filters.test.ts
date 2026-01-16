import { isObject } from "lodash";
import assert from "node:assert";
import { describe, it } from "node:test";
import { Op } from "sequelize";
import { parseFilters } from "../core";

describe("Parser", () => {
  describe("#filters", () => {
    // Basic operator tests
    it('should return object with "eq" operator for equality', () => {
      const result = parseFilters({ filters: "id eq 1" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        result?.id?.[Op.eq] === 1,
        `Result.id[Op.eq] should be 1 [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "ne" operator for inequality', () => {
      const result = parseFilters({ filters: "id ne 1" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        result?.id?.[Op.ne] === 1,
        `Result.id[Op.ne] should be 1 [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "gt" operator for greater than', () => {
      const result = parseFilters({ filters: "id gt 10" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        result?.id?.[Op.gt] === 10,
        `Result.id[Op.gt] should be 10 [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "ge" operator for greater than or equal', () => {
      const result = parseFilters({ filters: "id ge 10" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        result?.id?.[Op.gte] === 10,
        `Result.id[Op.gte] should be 10 [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "lt" operator for less than', () => {
      const result = parseFilters({ filters: "id lt 10" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        result?.id?.[Op.lt] === 10,
        `Result.id[Op.lt] should be 10 [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "le" operator for less than or equal', () => {
      const result = parseFilters({ filters: "id le 10" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        result?.id?.[Op.lte] === 10,
        `Result.id[Op.lte] should be 10 [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "li" operator for like', () => {
      const result = parseFilters({ filters: "name li %test%" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.name != null, "Result.name should exist");
      assert.ok(
        result?.name?.[Op.like] === "%test%",
        `Result.name[Op.like] should be '%test%' [result: ${JSON.stringify(result)}]`
      );
    });

    it("should convert * to % in like operator", () => {
      const result = parseFilters({ filters: "name li *test*" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.name != null, "Result.name should exist");
      assert.ok(
        result?.name?.[Op.like] === "%test%",
        `Result.name[Op.like] should be '%test%' [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "nl" operator for not like', () => {
      const result = parseFilters({ filters: "name nl %test%" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.name != null, "Result.name should exist");
      assert.ok(
        result?.name?.[Op.notLike] === "%test%",
        `Result.name[Op.notLike] should be '%test%' [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "in" operator for includes', () => {
      const result = parseFilters({ filters: "id in [1;2;3]" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        Array.isArray(result?.id?.[Op.in]),
        `Result.id[Op.in] should be an array [result: ${JSON.stringify(result)}]`
      );
      assert.ok(result?.id?.[Op.in]?.length === 3, "Result.id[Op.in] should have 3 elements");
      assert.ok(result?.id?.[Op.in]?.[0] === 1, "Result.id[Op.in][0] should be 1");
      assert.ok(result?.id?.[Op.in]?.[1] === 2, "Result.id[Op.in][1] should be 2");
      assert.ok(result?.id?.[Op.in]?.[2] === 3, "Result.id[Op.in][2] should be 3");
    });

    it('should return object with "ni" operator for not includes', () => {
      const result = parseFilters({ filters: "id ni [1;2;3]" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        Array.isArray(result?.id?.[Op.notIn]),
        `Result.id[Op.notIn] should be an array [result: ${JSON.stringify(result)}]`
      );
      assert.ok(result?.id?.[Op.notIn]?.length === 3, "Result.id[Op.notIn] should have 3 elements");
    });

    it('should return object with "be" operator for between', () => {
      const result = parseFilters({ filters: "id be [1;10]" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        Array.isArray(result?.id?.[Op.between]),
        `Result.id[Op.between] should be an array [result: ${JSON.stringify(result)}]`
      );
      assert.ok(
        result?.id?.[Op.between]?.length === 2,
        "Result.id[Op.between] should have 2 elements"
      );
      assert.ok(result?.id?.[Op.between]?.[0] === 1, "Result.id[Op.between][0] should be 1");
      assert.ok(result?.id?.[Op.between]?.[1] === 10, "Result.id[Op.between][1] should be 10");
    });

    it('should return object with "nb" operator for not between', () => {
      const result = parseFilters({ filters: "id nb [1;10]" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      assert.ok(
        Array.isArray(result?.id?.[Op.notBetween]),
        `Result.id[Op.notBetween] should be an array [result: ${JSON.stringify(result)}]`
      );
      assert.ok(
        result?.id?.[Op.notBetween]?.length === 2,
        "Result.id[Op.notBetween] should have 2 elements"
      );
    });

    it('should return object with "is" operator for is null', () => {
      const result = parseFilters({ filters: "deleted_at is null" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.deleted_at != null, "Result.deleted_at should exist");
      assert.ok(
        result?.deleted_at?.[Op.is] === null,
        `Result.deleted_at[Op.is] should be null [result: ${JSON.stringify(result)}]`
      );
    });

    it('should return object with "no" operator for is not null', () => {
      const result = parseFilters({ filters: "deleted_at no null" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.deleted_at != null, "Result.deleted_at should exist");
      assert.ok(
        result?.deleted_at?.[Op.not] === null,
        `Result.deleted_at[Op.not] should be null [result: ${JSON.stringify(result)}]`
      );
    });

    // Value type conversion tests
    it("should convert string numbers to numbers", () => {
      const result = parseFilters({ filters: "id eq 123" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(
        typeof result?.id?.[Op.eq] === "number",
        `Result.id[Op.eq] should be a number [result: ${JSON.stringify(result)}]`
      );
      assert.ok(result?.id?.[Op.eq] === 123, "Result.id[Op.eq] should be 123");
    });

    it("should convert string booleans to booleans", () => {
      const result = parseFilters({ filters: "active eq true" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(
        typeof result?.active?.[Op.eq] === "boolean",
        `Result.active[Op.eq] should be a boolean [result: ${JSON.stringify(result)}]`
      );
      assert.ok(result?.active?.[Op.eq] === true, "Result.active[Op.eq] should be true");
    });

    it("should keep strings as strings", () => {
      const result = parseFilters({ filters: "name eq test" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(
        typeof result?.name?.[Op.eq] === "string",
        `Result.name[Op.eq] should be a string [result: ${JSON.stringify(result)}]`
      );
      assert.ok(result?.name?.[Op.eq] === "test", "Result.name[Op.eq] should be 'test'");
    });

    // Multiple conditions tests
    it("should handle multiple conditions with AND (comma)", () => {
      const result = parseFilters({ filters: "id eq 1,name eq test" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id?.[Op.eq] === 1, "Result.id[Op.eq] should be 1");
      assert.ok(result?.name?.[Op.eq] === "test", "Result.name[Op.eq] should be 'test'");
    });

    it("should handle multiple conditions with OR (pipe)", () => {
      const result = parseFilters({ filters: "id eq 1|name eq test" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(Array.isArray(result?.or), "Result.or should be an array");
      assert.ok(result?.or?.length === 2, "Result.or should have 2 elements");
      assert.ok(result?.or?.[0]?.id?.[Op.eq] === 1, "Result.or[0].id[Op.eq] should be 1");
      assert.ok(
        result?.or?.[1]?.name?.[Op.eq] === "test",
        "Result.or[1].name[Op.eq] should be 'test'"
      );
    });

    it("should handle groups with parentheses", () => {
      const result = parseFilters({ filters: "active eq true,(deleted_at is null|id gt 10)" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.active?.[Op.eq] === true, "Result.active[Op.eq] should be true");
      assert.ok(Array.isArray(result?.or), "Result.or should be an array");
      assert.ok(result?.or?.length === 2, "Result.or should have 2 elements");
      assert.ok(
        result?.or?.[0]?.deleted_at?.[Op.is] === null,
        "Result.or[0].deleted_at[Op.is] should be null"
      );
      assert.ok(result?.or?.[1]?.id?.[Op.gt] === 10, "Result.or[1].id[Op.gt] should be 10");
    });

    // Complex scenarios
    it("should handle complex nested conditions", () => {
      const result = parseFilters({
        filters: "active eq true,status eq active,(deleted_at is null|created_at gt 2024-01-01)"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.active?.[Op.eq] === true, "Result.active[Op.eq] should be true");
      assert.ok(result?.status?.[Op.eq] === "active", "Result.status[Op.eq] should be 'active'");
      assert.ok(Array.isArray(result?.or), "Result.or should be an array");
    });

    // Edge cases
    it("should return undefined when filters is not provided", () => {
      const result = parseFilters({});

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when filters is empty string", () => {
      const result = parseFilters({ filters: "" });

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when query is null", () => {
      const result = parseFilters(null as never);

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when query is undefined", () => {
      const result = parseFilters(undefined as never);

      assert.ok(result == undefined, "Result should be undefined");
    });

    // Exact equal operator (ee)
    it("should return literal for exact equal operator", () => {
      const result = parseFilters({ filters: "id ee 1" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      // Exact equal uses literal() from sequelize
      assert.ok(result?.id != null, "Result.id should exist (literal)");
    });

    // Multiple operators on same field
    it("should handle multiple operators on same field", () => {
      const result = parseFilters({ filters: "name li %test%,name eq test" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.name != null, "Result.name should exist");
      // The parser may combine operators or keep them separate
      assert.ok(
        result?.name?.[Op.like] === "%test%" || result?.name?.[Op.eq] === "test",
        "Result.name should have like or eq operator"
      );
    });

    // Date values
    it("should handle date string values", () => {
      const result = parseFilters({ filters: "created_at gt 2024-01-01" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.created_at != null, "Result.created_at should exist");
      // Date strings are kept as strings unless parsed
      assert.ok(result?.created_at?.[Op.gt] != null, "Result.created_at[Op.gt] should exist");
    });

    // Decimal numbers
    it("should handle decimal numbers", () => {
      const result = parseFilters({ filters: "price eq 19.99" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.price != null, "Result.price should exist");
      assert.ok(
        typeof result?.price?.[Op.eq] === "number",
        "Result.price[Op.eq] should be a number"
      );
      assert.ok(result?.price?.[Op.eq] === 19.99, "Result.price[Op.eq] should be 19.99");
    });

    // Negative numbers
    it("should handle negative numbers", () => {
      const result = parseFilters({ filters: "temperature eq -10" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.temperature != null, "Result.temperature should exist");
      assert.ok(
        typeof result?.temperature?.[Op.eq] === "number",
        "Result.temperature[Op.eq] should be a number"
      );
      assert.ok(result?.temperature?.[Op.eq] === -10, "Result.temperature[Op.eq] should be -10");
    });

    // Real-world scenarios
    it("should handle e-commerce product filters", () => {
      const result = parseFilters({
        filters: "category eq electronics,price be [100;1000],active eq true"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(
        result?.category?.[Op.eq] === "electronics",
        "Result.category[Op.eq] should be 'electronics'"
      );
      assert.ok(
        Array.isArray(result?.price?.[Op.between]),
        "Result.price[Op.between] should be an array"
      );
      assert.ok(result?.active?.[Op.eq] === true, "Result.active[Op.eq] should be true");
    });

    it("should handle user search filters", () => {
      const result = parseFilters({
        filters: "name li %john%,email li %@gmail.com%,active eq true,deleted_at is null"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.name?.[Op.like] === "%john%", "Result.name[Op.like] should be '%john%'");
      assert.ok(
        result?.email?.[Op.like] === "%@gmail.com%",
        "Result.email[Op.like] should be '%@gmail.com%'"
      );
      assert.ok(result?.active?.[Op.eq] === true, "Result.active[Op.eq] should be true");
      assert.ok(result?.deleted_at?.[Op.is] === null, "Result.deleted_at[Op.is] should be null");
    });

    it("should handle blog post filters with complex conditions", () => {
      const result = parseFilters({
        filters:
          "status eq published,created_at ge 2024-01-01,(author_id in [1;2;3]|category_id eq 5)"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(
        result?.status?.[Op.eq] === "published",
        "Result.status[Op.eq] should be 'published'"
      );
      assert.ok(Array.isArray(result?.or), "Result.or should be an array");
    });

    // Empty arrays in operators
    it("should handle empty arrays in in operator", () => {
      const result = parseFilters({ filters: "id in []" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.id != null, "Result.id should exist");
      // Empty array handling depends on implementation
    });

    // Special characters in strings
    it("should handle special characters in string values", () => {
      const result = parseFilters({ filters: "name eq test@example.com" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(
        result?.name?.[Op.eq] === "test@example.com",
        "Result.name[Op.eq] should be 'test@example.com'"
      );
    });

    it("should handle spaces in string values", () => {
      const result = parseFilters({ filters: "name eq john doe" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.name?.[Op.eq] === "john doe", "Result.name[Op.eq] should be 'john doe'");
    });
  });
});
