import { isArray, isObject } from "lodash";
import assert from "node:assert";
import { describe, it } from "node:test";
import { Op } from "sequelize";
import { parseQuery } from "../core";

describe("Parser", () => {
  describe("#parseQuery", () => {
    // Basic tests - individual parsers
    it("should parse pagination only", () => {
      const result = parseQuery({ page: 1, pageSize: 10 });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(
        result?.limit === 10,
        `Result.limit should be 10 [result: ${JSON.stringify(result)}]`
      );
      assert.ok(
        result?.offset === 0,
        `Result.offset should be 0 [result: ${JSON.stringify(result)}]`
      );
    });

    it("should parse filters only", () => {
      const result = parseQuery({ filters: "id eq 1" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.where != null, "Result.where should exist");
      assert.ok(result?.where?.id?.[Op.eq] === 1, "Result.where.id[Op.eq] should be 1");
    });

    it("should parse fields only", () => {
      const result = parseQuery({ fields: "id,name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(result?.attributes?.includes("id"), "Result.attributes should include 'id'");
      assert.ok(result?.attributes?.includes("name"), "Result.attributes should include 'name'");
    });

    it("should parse include only", () => {
      const result = parseQuery({ include: "user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 1, "Result.include should have 1 element");
      assert.ok(
        result?.include?.[0]?.association === "user",
        "Result.include[0].association should be 'user'"
      );
    });

    it("should parse order only", () => {
      const result = parseQuery({ order: "id-DESC" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.order), "Result.order should be an array");
      assert.ok(result?.order?.length === 1, "Result.order should have 1 element");
      assert.ok(Array.isArray(result?.order?.[0]), "Result.order[0] should be an array");
      assert.ok(result?.order?.[0]?.[0] === "id", "Result.order[0][0] should be 'id'");
      assert.ok(result?.order?.[0]?.[1] === "DESC", "Result.order[0][1] should be 'DESC'");
    });

    it("should parse group only", () => {
      const result = parseQuery({ group: "id" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.group), "Result.group should be an array");
      assert.ok(result?.group?.length === 1, "Result.group should have 1 element");
      assert.ok(result?.group?.[0] === "id", "Result.group[0] should be 'id'");
    });

    // Combined tests
    it("should parse pagination and filters", () => {
      const result = parseQuery({ page: 1, pageSize: 10, filters: "id eq 1" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      assert.ok(result?.where?.id?.[Op.eq] === 1, "Result.where.id[Op.eq] should be 1");
    });

    it("should parse pagination, filters and fields", () => {
      const result = parseQuery({ page: 1, pageSize: 10, filters: "id eq 1", fields: "id,name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      assert.ok(result?.where?.id?.[Op.eq] === 1, "Result.where.id[Op.eq] should be 1");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(result?.attributes?.includes("id"), "Result.attributes should include 'id'");
      assert.ok(result?.attributes?.includes("name"), "Result.attributes should include 'name'");
    });

    it("should parse pagination, filters, fields and include", () => {
      const result = parseQuery({
        page: 1,
        pageSize: 10,
        filters: "id eq 1",
        fields: "id,name",
        include: "user"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      assert.ok(result?.where?.id?.[Op.eq] === 1, "Result.where.id[Op.eq] should be 1");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(
        result?.include?.[0]?.association === "user",
        "Result.include[0].association should be 'user'"
      );
    });

    it("should parse all options together", () => {
      const result = parseQuery({
        page: 1,
        pageSize: 10,
        filters: "id eq 1",
        fields: "id,name",
        include: "user",
        order: "id-DESC",
        group: "status"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      assert.ok(result?.where?.id?.[Op.eq] === 1, "Result.where.id[Op.eq] should be 1");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(isArray(result?.order), "Result.order should be an array");
      assert.ok(isArray(result?.group), "Result.group should be an array");
    });

    // Fields with functions
    it("should parse fields with functions", () => {
      const result = parseQuery({ fields: "id,COUNT-amount" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(result?.attributes?.includes("id"), "Result.attributes should include 'id'");
      const countField = result?.attributes?.find((attr) => Array.isArray(attr));

      assert.ok(countField != null, "Result.attributes should contain a function field");
    });

    // Include with nested relations
    it("should parse include with nested relations", () => {
      const result = parseQuery({ include: "user.profile" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 1, "Result.include should have 1 element");
      assert.ok(
        result?.include?.[0]?.association === "user",
        "Result.include[0].association should be 'user'"
      );
      assert.ok(
        isArray(result?.include?.[0]?.include),
        "Result.include[0].include should be an array"
      );
      assert.ok(
        result?.include?.[0]?.include?.[0]?.association === "profile",
        "Result.include[0].include[0].association should be 'profile'"
      );
    });

    // Filters with complex conditions
    it("should parse filters with OR conditions", () => {
      const result = parseQuery({ filters: "id eq 1|name eq test" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.where != null, "Result.where should exist");
      assert.ok(Array.isArray(result?.where?.[Op.or]), "Result.where[Op.or] should be an array");
    });

    it("should parse filters with groups", () => {
      const result = parseQuery({ filters: "active eq true,(deleted_at is null|id gt 10)" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.where != null, "Result.where should exist");
      assert.ok(
        result?.where?.active?.[Op.eq] === true,
        "Result.where.active[Op.eq] should be true"
      );
      assert.ok(Array.isArray(result?.where?.[Op.or]), "Result.where[Op.or] should be an array");
    });

    // Fields with relations
    it("should parse fields with relations", () => {
      const result = parseQuery({ fields: "id,user.name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(result?.attributes?.includes("id"), "Result.attributes should include 'id'");
      // Relations are stored in relations object
      assert.ok(result?.relations != null, "Result.relations should exist");
    });

    // Include with relations fields
    it("should parse include with relation fields", () => {
      const result = parseQuery({ include: "user", fields: "user.name" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(
        result?.include?.[0]?.association === "user",
        "Result.include[0].association should be 'user'"
      );
    });

    // Remote properties
    it("should parse remote properties in fields", () => {
      const result = parseQuery({ fields: "id,r-user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.remotes), "Result.remotes should be an array");
      assert.ok(result?.remotes?.includes("user"), "Result.remotes should include 'user'");
    });

    it("should parse remote properties in include", () => {
      const result = parseQuery({ include: "r-user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.remotes), "Result.remotes should be an array");
      assert.ok(result?.remotes?.includes("user"), "Result.remotes should include 'user'");
    });

    // Extra properties
    it("should parse extra properties in fields", () => {
      const result = parseQuery({ fields: "id,e-category" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.extras), "Result.extras should be an array");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
    });

    it("should parse extra properties in include", () => {
      const result = parseQuery({ include: "e-category" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.extras), "Result.extras should be an array");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
    });

    // Filters with nested fields (associations)
    it("should parse filters with nested fields", () => {
      const result = parseQuery({ filters: "user.id eq 1" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.where == null, "Result.where should not exists");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length > 0, "Result.include should have elements");
      // The nested filter should create an include
      const userInclude = result?.include?.find((inc) => inc?.association === "user");

      assert.ok(userInclude != null, "Result.include should contain 'user' association");
    });

    // Multiple order fields
    it("should parse multiple order fields", () => {
      const result = parseQuery({ order: "id-DESC,name-ASC" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.order), "Result.order should be an array");
      assert.ok(result?.order?.length === 2, "Result.order should have 2 elements");
      assert.ok(result?.order?.[0]?.[0] === "id", "Result.order[0][0] should be 'id'");
      assert.ok(result?.order?.[0]?.[1] === "DESC", "Result.order[0][1] should be 'DESC'");
      assert.ok(result?.order?.[1]?.[0] === "name", "Result.order[1][0] should be 'name'");
      assert.ok(result?.order?.[1]?.[1] === "ASC", "Result.order[1][1] should be 'ASC'");
    });

    // Multiple group fields
    it("should parse multiple group fields", () => {
      const result = parseQuery({ group: "status,created_at" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.group), "Result.group should be an array");
      assert.ok(result?.group?.length === 2, "Result.group should have 2 elements");
      assert.ok(result?.group?.includes("status"), "Result.group should include 'status'");
      assert.ok(result?.group?.includes("created_at"), "Result.group should include 'created_at'");
    });

    // Raw query options
    it("should include raw query options when includeRaw is true in query", () => {
      const result = parseQuery({ page: 1, pageSize: 10, includeRaw: true });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.rawQueryOptions != null, "Result.rawQueryOptions should exist");
      assert.ok(result?.rawQueryOptions?.page === 1, "Result.rawQueryOptions.page should be 1");
      assert.ok(
        result?.rawQueryOptions?.pageSize === 10,
        "Result.rawQueryOptions.pageSize should be 10"
      );
    });

    it("should include raw query options when includeRaw is true in options", () => {
      const result = parseQuery({ page: 1, pageSize: 10 }, { includeRaw: true });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.rawQueryOptions != null, "Result.rawQueryOptions should exist");
    });

    // Raw mode
    it("should return raw options when raw is true in query", () => {
      const result = parseQuery({ page: 1, pageSize: 10, raw: true });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      // In raw mode, it should not be parsed to sequelize format
      assert.ok(result?.limit != null, "Result should have limit (raw format)");
    });

    it("should return raw options when raw is true in options", () => {
      const result = parseQuery({ page: 1, pageSize: 10 }, { raw: true });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
    });

    // Complex real-world scenarios
    it("should parse complex e-commerce query", () => {
      const result = parseQuery({
        page: 2,
        pageSize: 20,
        filters: "category eq electronics,price be [100;1000],active eq true",
        fields: "id,name,price,COUNT-reviews",
        include: "category,brand,images",
        order: "price-ASC,name-ASC",
        group: "category"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 20, "Result.limit should be 20");
      assert.ok(result?.offset === 20, "Result.offset should be 20");
      assert.ok(result?.where != null, "Result.where should exist");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(isArray(result?.order), "Result.order should be an array");
      assert.ok(isArray(result?.group), "Result.group should be an array");
    });

    it("should parse complex blog post query", () => {
      const result = parseQuery({
        page: 1,
        pageSize: 10,
        filters:
          "status eq published,created_at ge 2024-01-01,(author_id in [1;2;3]|category_id eq 5)",
        fields: "id,title,created_at,author.name",
        include: "author.profile,categories,tags,comments.author",
        order: "created_at-DESC"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      assert.ok(result?.where != null, "Result.where should exist");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(isArray(result?.order), "Result.order should be an array");
    });

    it("should parse user search query with all options", () => {
      const result = parseQuery({
        page: 1,
        pageSize: 50,
        filters: "name li %john%,email li %@gmail.com%,active eq true,deleted_at is null",
        fields: "id,name,email,user.profile.avatar",
        include: "profile,settings",
        order: "name-ASC,created_at-DESC",
        group: "role"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 50, "Result.limit should be 50");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
      assert.ok(result?.where != null, "Result.where should exist");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(isArray(result?.order), "Result.order should be an array");
      assert.ok(isArray(result?.group), "Result.group should be an array");
    });

    // Edge cases
    it("should handle empty query", () => {
      const result = parseQuery({});

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      // Should return empty object or minimal structure
    });

    it("should handle query with only undefined values", () => {
      const result = parseQuery({
        page: undefined,
        pageSize: undefined,
        filters: undefined,
        fields: undefined,
        include: undefined,
        order: undefined,
        group: undefined
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
    });

    // Merging relations from fields and include
    it("should merge relations from fields and include", () => {
      const result = parseQuery({
        fields: "id,user.name",
        include: "user.profile"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      // Relations should be merged
      const userInclude = result?.include?.find((inc) => inc?.association === "user");

      assert.ok(userInclude != null, "Result.include should contain 'user' association");
    });

    // Merging remotes from fields and include
    it("should merge remotes from fields and include", () => {
      const result = parseQuery({
        fields: "id,r-user",
        include: "r-profile"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.remotes), "Result.remotes should be an array");
      assert.ok(result?.remotes?.includes("user"), "Result.remotes should include 'user'");
      assert.ok(result?.remotes?.includes("profile"), "Result.remotes should include 'profile'");
    });

    // Merging extras from fields and include
    it("should merge extras from fields and include", () => {
      const result = parseQuery({
        fields: "id,e-category",
        include: "e-brand"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.extras), "Result.extras should be an array");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
      assert.ok(result?.extras?.includes("brand"), "Result.extras should include 'brand'");
    });

    // Fields with wildcard
    it("should handle fields with wildcard", () => {
      const result = parseQuery({ fields: "*" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      // Wildcard should result in null attributes or no attributes key
      assert.ok(
        result?.attributes == null || result?.attributes?.length === 0,
        "Result.attributes should be null or empty"
      );
    });

    // Pagination edge cases
    it("should handle pagination without page", () => {
      const result = parseQuery({ pageSize: 10 });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
    });

    it("should handle pagination with page 0", () => {
      const result = parseQuery({ page: 0, pageSize: 10 });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.limit === 10, "Result.limit should be 10");
      assert.ok(result?.offset === 0, "Result.offset should be 0");
    });

    // Complex nested filters with includes
    it("should handle filters on nested associations", () => {
      const result = parseQuery({
        filters: "user.id eq 1,user.profile.name eq admin",
        include: "user.profile"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(result?.where == null, "Result.where should not exists");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      // Nested filters should create nested includes
      const userInclude = result?.include?.find((inc) => inc?.association === "user");

      assert.ok(userInclude != null, "Result.include should contain 'user' association");
    });

    // Order with function fields
    it("should handle order with function fields in attributes", () => {
      const result = parseQuery({
        fields: "id,COUNT-amount",
        order: "id-DESC"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.order), "Result.order should be an array");
    });

    // Group with function fields
    it("should handle group with function fields", () => {
      const result = parseQuery({
        fields: "id,COUNT-amount",
        group: "status"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isObject(result), "Result should be an object");
      assert.ok(isArray(result?.attributes), "Result.attributes should be an array");
      assert.ok(isArray(result?.group), "Result.group should be an array");
    });
  });
});
