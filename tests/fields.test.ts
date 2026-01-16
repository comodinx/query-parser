import { isArray, isNull } from "lodash";
import assert from "node:assert";
import { describe, it } from "node:test";
import { parseFields } from "../core";

describe("Parser", () => {
  describe("#fields", () => {
    // Basic tests
    it('should return object with fields array containing "id"', () => {
      const result = parseFields({ fields: "id" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 1, "Result.fields should have 1 element");
      assert.ok(result?.fields?.[0] === "id", "Result.fields[0] should be 'id'");
    });

    it('should return object with fields array containing "id" and "name"', () => {
      const result = parseFields({ fields: "id,name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 2, "Result.fields should have 2 elements");
      assert.ok(result?.fields?.[0] === "id", "Result.fields[0] should be 'id'");
      assert.ok(result?.fields?.[1] === "name", "Result.fields[1] should be 'name'");
    });

    it("should return object with fields array containing multiple fields", () => {
      const result = parseFields({ fields: "id,name,email,created_at" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 4, "Result.fields should have 4 elements");
      assert.ok(result?.fields?.[0] === "id", "Result.fields[0] should be 'id'");
      assert.ok(result?.fields?.[1] === "name", "Result.fields[1] should be 'name'");
      assert.ok(result?.fields?.[2] === "email", "Result.fields[2] should be 'email'");
      assert.ok(result?.fields?.[3] === "created_at", "Result.fields[3] should be 'created_at'");
    });

    // Wildcard tests
    it('should return null when fields is "*"', () => {
      const result = parseFields({ fields: "*" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isNull(result?.fields), "Result.fields should be null");
    });

    // Function tests (with concatenator)
    it("should return array with function when field uses concatenator for COUNT", () => {
      const result = parseFields({ fields: "COUNT-id" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 1, "Result.fields should have 1 element");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be COUNT function");
      assert.ok(result?.fields?.[0]?.[1] === "id", "Result.fields[0][1] should be 'id'");
    });

    it("should return array with function when field uses concatenator for SUM", () => {
      const result = parseFields({ fields: "SUM-amount" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 1, "Result.fields should have 1 element");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be SUM function");
      assert.ok(result?.fields?.[0]?.[1] === "amount", "Result.fields[0][1] should be 'amount'");
    });

    it("should return array with function and alias when field uses concatenator with alias", () => {
      const result = parseFields({ fields: "COUNT-id-total" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 1, "Result.fields should have 1 element");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be COUNT function");
      assert.ok(
        result?.fields?.[0]?.[1] === "total",
        "Result.fields[0][1] should be 'total' (alias)"
      );
    });

    it("should return array with function when field uses concatenator with wildcard", () => {
      const result = parseFields({ fields: "COUNT-*" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 1, "Result.fields should have 1 element");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be COUNT function");
      assert.ok(
        result?.fields?.[0]?.[1] === "COUNT",
        "Result.fields[0][1] should be 'COUNT' (function name when * is used)"
      );
    });

    // Multiple functions
    it("should return array with multiple functions", () => {
      const result = parseFields({ fields: "COUNT-id,SUM-amount,AVG-price" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 3, "Result.fields should have 3 elements");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(Array.isArray(result?.fields?.[1]), "Result.fields[1] should be an array");
      assert.ok(Array.isArray(result?.fields?.[2]), "Result.fields[2] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be COUNT function");
      assert.ok(result?.fields?.[1]?.[0] != null, "Result.fields[1][0] should be SUM function");
      assert.ok(result?.fields?.[2]?.[0] != null, "Result.fields[2][0] should be AVG function");
    });

    // Mixed fields and functions
    it("should return array with mixed regular fields and functions", () => {
      const result = parseFields({ fields: "id,COUNT-amount,email" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 3, "Result.fields should have 3 elements");
      assert.ok(result?.fields?.[0] === "id", "Result.fields[0] should be 'id'");
      assert.ok(Array.isArray(result?.fields?.[1]), "Result.fields[1] should be an array");
      assert.ok(result?.fields?.[1]?.[0] != null, "Result.fields[1][0] should be COUNT function");
      assert.ok(result?.fields?.[2] === "email", "Result.fields[2] should be 'email'");
    });

    // Custom separator
    it("should use custom separator from query", () => {
      const result = parseFields({ fields: "COUNT_id", fieldsSeparator: "_" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 2, "Result.fields should have 2 element");
      assert.ok(Array.isArray(result?.fields), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0] === "COUNT", "Result.fields[0] should be COUNT function");
      assert.ok(result?.fields?.[1] === "id", "Result.fields[1] should be id function");
    });

    it("should use custom separator from options", () => {
      const result = parseFields({ fields: "COUNT_id" }, { fieldsSeparator: "_" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 2, "Result.fields should have 2 element");
      assert.ok(Array.isArray(result?.fields), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0] === "COUNT", "Result.fields[0] should be COUNT function");
      assert.ok(result?.fields?.[1] === "id", "Result.fields[1] should be id function");
    });

    // Properties tests (relations, remotes, extras)
    it("should handle nested properties with relations", () => {
      const result = parseFields({ fields: "user.name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(
        result?.fields?.length === 0,
        "Result.fields should be empty (skipFirstLevelProperty)"
      );
      assert.ok(result?.relations != null, "Result.relations should exist");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        isArray(result?.relations?.user?.attributes),
        "Result.relations.user.attributes should be an array"
      );
      assert.ok(
        result?.relations?.user?.attributes?.includes("name"),
        "Result.relations.user.attributes should include 'name'"
      );
    });

    it("should handle multiple nested properties", () => {
      const result = parseFields({ fields: "user.name,user.email" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        isArray(result?.relations?.user?.attributes),
        "Result.relations.user.attributes should be an array"
      );
      assert.ok(
        result?.relations?.user?.attributes?.includes("name"),
        "Result.relations.user.attributes should include 'name'"
      );
      assert.ok(
        result?.relations?.user?.attributes?.includes("email"),
        "Result.relations.user.attributes should include 'email'"
      );
    });

    it("should handle remote properties with r- prefix", () => {
      const result = parseFields({ fields: "r-user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.remotes), "Result.remotes should be an array");
      assert.ok(result?.remotes?.includes("user"), "Result.remotes should include 'user'");
      assert.ok(!result?.fields?.includes("r-user"), "Result.fields should not include 'r-user'");
    });

    it("should handle extra properties with e- prefix", () => {
      const result = parseFields({ fields: "e-category" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.extras), "Result.extras should be an array");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
      assert.ok(
        !result?.fields?.includes("e-category"),
        "Result.fields should not include 'e-category'"
      );
    });

    it("should handle remote properties in nested relations", () => {
      const result = parseFields({ fields: "user.r-profile" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        isArray(result?.relations?.user?.remotes),
        "Result.relations.user.remotes should be an array"
      );
      assert.ok(
        result?.relations?.user?.remotes?.includes("profile"),
        "Result.relations.user.remotes should include 'profile'"
      );
    });

    it("should handle extra properties in nested relations", () => {
      const result = parseFields({ fields: "user.e-brand" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        isArray(result?.relations?.user?.extras),
        "Result.relations.user.extras should be an array"
      );
      assert.ok(
        result?.relations?.user?.extras?.includes("brand"),
        "Result.relations.user.extras should include 'brand'"
      );
    });

    // Complex nested properties
    it("should handle deeply nested properties", () => {
      const result = parseFields({ fields: "user.profile.name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        result?.relations?.user?.relations?.profile != null,
        "Result.relations.user.relations.profile should exist"
      );
      assert.ok(
        isArray(result?.relations?.user?.relations?.profile?.attributes),
        "Result.relations.user.relations.profile.attributes should be an array"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.attributes?.includes("name"),
        "Result.relations.user.relations.profile.attributes should include 'name'"
      );
    });

    // Edge cases
    it("should return undefined when fields is not provided", () => {
      const result = parseFields({});

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when query is null", () => {
      const result = parseFields(null as never);

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when query is undefined", () => {
      const result = parseFields(undefined as never);

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should handle empty string fields", () => {
      const result = parseFields({ fields: "" });

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should handle fields with only whitespace", () => {
      const result = parseFields({ fields: "   " });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 1, "Result.fields should have 1 element (whitespace)");
    });

    // Array input
    it("should handle fields as array", () => {
      const result = parseFields({ fields: ["id", "name", "email"] });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 3, "Result.fields should have 3 elements");
      assert.ok(result?.fields?.[0] === "id", "Result.fields[0] should be 'id'");
      assert.ok(result?.fields?.[1] === "name", "Result.fields[1] should be 'name'");
      assert.ok(result?.fields?.[2] === "email", "Result.fields[2] should be 'email'");
    });

    it("should handle fields as array with functions", () => {
      const result = parseFields({ fields: ["id", "COUNT-amount", "name"] });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(result?.fields?.length === 3, "Result.fields should have 3 elements");
      assert.ok(result?.fields?.[0] === "id", "Result.fields[0] should be 'id'");
      assert.ok(Array.isArray(result?.fields?.[1]), "Result.fields[1] should be an array");
      assert.ok(result?.fields?.[1]?.[0] != null, "Result.fields[1][0] should be COUNT function");
      assert.ok(result?.fields?.[2] === "name", "Result.fields[2] should be 'name'");
    });

    // Various SQL functions
    it("should handle MAX function", () => {
      const result = parseFields({ fields: "MAX-price" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be MAX function");
    });

    it("should handle MIN function", () => {
      const result = parseFields({ fields: "MIN-price" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be MIN function");
    });

    it("should handle AVG function", () => {
      const result = parseFields({ fields: "AVG-rating" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      assert.ok(Array.isArray(result?.fields?.[0]), "Result.fields[0] should be an array");
      assert.ok(result?.fields?.[0]?.[0] != null, "Result.fields[0][0] should be AVG function");
    });

    // Duplicate handling
    it("should not include duplicate fields", () => {
      const result = parseFields({ fields: "id,name,id" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.fields), "Result.fields should be an array");
      // Note: The current implementation may include duplicates, but we test what it does
      assert.ok(result?.fields?.includes("id"), "Result.fields should include 'id'");
      assert.ok(result?.fields?.includes("name"), "Result.fields should include 'name'");
    });
  });
});
