import { isArray } from "lodash";
import assert from "node:assert";
import { describe, it } from "node:test";
import { parseInclude } from "../core";

describe("Parser", () => {
  describe("#include", () => {
    // Basic tests
    it('should return object with include array containing "user"', () => {
      const result = parseInclude({ include: "user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 1, "Result.include should have 1 element");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
    });

    it('should return object with include array containing "user" and "profile"', () => {
      const result = parseInclude({ include: "user,profile" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 2, "Result.include should have 2 elements");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
      assert.ok(result?.include?.[1] === "profile", "Result.include[1] should be 'profile'");
    });

    it("should return object with include array containing multiple associations", () => {
      const result = parseInclude({ include: "user,profile,comments,tags" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 4, "Result.include should have 4 elements");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
      assert.ok(result?.include?.[1] === "profile", "Result.include[1] should be 'profile'");
      assert.ok(result?.include?.[2] === "comments", "Result.include[2] should be 'comments'");
      assert.ok(result?.include?.[3] === "tags", "Result.include[3] should be 'tags'");
    });

    // Nested properties tests
    it("should handle nested properties with relations", () => {
      const result = parseInclude({ include: "user.profile" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 1, "Result.include should have 1 element");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
      assert.ok(result?.relations != null, "Result.relations should exist");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        isArray(result?.relations?.user?.include),
        "Result.relations.user.include should be an array"
      );
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
    });

    it("should handle multiple nested properties on same level", () => {
      const result = parseInclude({ include: "user.profile,user.settings" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        isArray(result?.relations?.user?.include),
        "Result.relations.user.include should be an array"
      );
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
      assert.ok(
        result?.relations?.user?.include?.includes("settings"),
        "Result.relations.user.include should include 'settings'"
      );
    });

    it("should handle deeply nested properties", () => {
      const result = parseInclude({ include: "user.profile.address" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile != null,
        "Result.relations.user.relations.profile should exist"
      );
      assert.ok(
        isArray(result?.relations?.user?.relations?.profile?.include),
        "Result.relations.user.relations.profile.include should be an array"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.include?.includes("address"),
        "Result.relations.user.relations.profile.include should include 'address'"
      );
    });

    it("should handle multiple deeply nested properties", () => {
      const result = parseInclude({ include: "user.profile.address,user.profile.phone" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(
        result?.relations?.user?.relations?.profile != null,
        "Result.relations.user.relations.profile should exist"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.include?.includes("address"),
        "Result.relations.user.relations.profile.include should include 'address'"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.include?.includes("phone"),
        "Result.relations.user.relations.profile.include should include 'phone'"
      );
    });

    // Remote properties tests
    it("should handle remote properties with r- prefix", () => {
      const result = parseInclude({ include: "r-user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.remotes), "Result.remotes should be an array");
      assert.ok(result?.remotes?.includes("user"), "Result.remotes should include 'user'");
      assert.ok(!result?.include?.includes("r-user"), "Result.include should not include 'r-user'");
    });

    it("should handle multiple remote properties", () => {
      const result = parseInclude({ include: "r-user,r-profile" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.remotes), "Result.remotes should be an array");
      assert.ok(result?.remotes?.includes("user"), "Result.remotes should include 'user'");
      assert.ok(result?.remotes?.includes("profile"), "Result.remotes should include 'profile'");
    });

    it("should handle remote properties in nested relations", () => {
      const result = parseInclude({ include: "user.r-profile" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
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

    it("should handle remote properties in deeply nested relations", () => {
      const result = parseInclude({ include: "user.profile.r-address" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(
        result?.relations?.user?.relations?.profile != null,
        "Result.relations.user.relations.profile should exist"
      );
      assert.ok(
        isArray(result?.relations?.user?.relations?.profile?.remotes),
        "Result.relations.user.relations.profile.remotes should be an array"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.remotes?.includes("address"),
        "Result.relations.user.relations.profile.remotes should include 'address'"
      );
    });

    // Extra properties tests
    it("should handle extra properties with e- prefix", () => {
      const result = parseInclude({ include: "e-category" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.extras), "Result.extras should be an array");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
      assert.ok(
        !result?.include?.includes("e-category"),
        "Result.include should not include 'e-category'"
      );
    });

    it("should handle multiple extra properties", () => {
      const result = parseInclude({ include: "e-category,e-brand" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.extras), "Result.extras should be an array");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
      assert.ok(result?.extras?.includes("brand"), "Result.extras should include 'brand'");
    });

    it("should handle extra properties in nested relations", () => {
      const result = parseInclude({ include: "user.e-brand" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
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

    it("should handle extra properties in deeply nested relations", () => {
      const result = parseInclude({ include: "user.profile.e-phone" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(
        result?.relations?.user?.relations?.profile != null,
        "Result.relations.user.relations.profile should exist"
      );
      assert.ok(
        isArray(result?.relations?.user?.relations?.profile?.extras),
        "Result.relations.user.relations.profile.extras should be an array"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.extras?.includes("phone"),
        "Result.relations.user.relations.profile.extras should include 'phone'"
      );
    });

    // Mixed properties tests
    it("should handle mix of regular, remote and extra properties", () => {
      const result = parseInclude({ include: "user,r-profile,e-category" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.remotes?.includes("profile"), "Result.remotes should include 'profile'");
      assert.ok(result?.extras?.includes("category"), "Result.extras should include 'category'");
    });

    it("should handle mix of nested regular, remote and extra properties", () => {
      const result = parseInclude({ include: "user.profile,user.r-settings,user.e-brand" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
      assert.ok(
        result?.relations?.user?.remotes?.includes("settings"),
        "Result.relations.user.remotes should include 'settings'"
      );
      assert.ok(
        result?.relations?.user?.extras?.includes("brand"),
        "Result.relations.user.extras should include 'brand'"
      );
    });

    // Custom separator tests
    it("should use custom separator from query", () => {
      const result = parseInclude({ include: "user;profile", includeSeparator: ";" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 2, "Result.include should have 2 elements");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
      assert.ok(result?.include?.[1] === "profile", "Result.include[1] should be 'profile'");
    });

    it("should use custom separator from options", () => {
      const result = parseInclude({ include: "user;profile" }, { includeSeparator: ";" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 2, "Result.include should have 2 elements");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
      assert.ok(result?.include?.[1] === "profile", "Result.include[1] should be 'profile'");
    });

    // Custom concatenator tests
    it("should use custom concatenator from query", () => {
      const result = parseInclude({ include: "user_profile", includeConcatenator: "_" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
    });

    it("should use custom concatenator from options", () => {
      const result = parseInclude({ include: "user_profile" }, { includeConcatenator: "_" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.relations?.user != null, "Result.relations.user should exist");
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
    });

    // Edge cases
    it("should return undefined when include is not provided", () => {
      const result = parseInclude({});

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when query is null", () => {
      const result = parseInclude(null as never);

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should return undefined when query is undefined", () => {
      const result = parseInclude(undefined as never);

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should handle empty string include", () => {
      const result = parseInclude({ include: "" });

      assert.ok(result == undefined, "Result should be undefined");
    });

    it("should handle include with only whitespace", () => {
      const result = parseInclude({ include: "   " });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 1, "Result.include should have 1 element (whitespace)");
    });

    // Array input
    it("should handle include as array", () => {
      const result = parseInclude({ include: ["user", "profile", "comments"] });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.length === 3, "Result.include should have 3 elements");
      assert.ok(result?.include?.[0] === "user", "Result.include[0] should be 'user'");
      assert.ok(result?.include?.[1] === "profile", "Result.include[1] should be 'profile'");
      assert.ok(result?.include?.[2] === "comments", "Result.include[2] should be 'comments'");
    });

    it("should handle include as array with nested properties", () => {
      const result = parseInclude({ include: ["user", "user.profile", "comments"] });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.include?.includes("comments"), "Result.include should include 'comments'");
      assert.ok(
        result?.relations?.user?.include?.includes("profile"),
        "Result.relations.user.include should include 'profile'"
      );
    });

    // Complex scenarios
    it("should handle complex nested structure with multiple levels", () => {
      const result = parseInclude({
        include: "user.profile.address.city,user.profile.phone,comments.author"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.include?.includes("comments"), "Result.include should include 'comments'");
      assert.ok(
        result?.relations?.user?.relations?.profile?.include?.includes("address"),
        "Result.relations.user.relations.profile.include should include 'address'"
      );
      assert.ok(
        result?.relations?.user?.relations?.profile?.include?.includes("phone"),
        "Result.relations.user.relations.profile.include should include 'phone'"
      );
      assert.ok(
        result?.relations?.comments?.include?.includes("author"),
        "Result.relations.comments.include should include 'author'"
      );
    });

    it("should handle duplicate includes", () => {
      const result = parseInclude({ include: "user,profile,user" });

      assert.ok(result != null, "Result should not be null");
      assert.ok(isArray(result?.include), "Result.include should be an array");
      assert.ok(result?.include?.includes("user"), "Result.include should include 'user'");
      assert.ok(result?.include?.includes("profile"), "Result.include should include 'profile'");
      // Note: The current implementation may include duplicates, but we test what it does
    });

    // Real-world scenarios
    it("should handle e-commerce product includes", () => {
      const result = parseInclude({
        include: "category,brand,images,reviews.user,reviews.product"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("category"), "Result.include should include 'category'");
      assert.ok(result?.include?.includes("brand"), "Result.include should include 'brand'");
      assert.ok(result?.include?.includes("images"), "Result.include should include 'images'");
      assert.ok(result?.include?.includes("reviews"), "Result.include should include 'reviews'");
      assert.ok(
        result?.relations?.reviews?.include?.includes("user"),
        "Result.relations.reviews.include should include 'user'"
      );
      assert.ok(
        result?.relations?.reviews?.include?.includes("product"),
        "Result.relations.reviews.include should include 'product'"
      );
    });

    it("should handle blog post includes", () => {
      const result = parseInclude({
        include: "author.profile,author.settings,categories,tags,comments.author"
      });

      assert.ok(result != null, "Result should not be null");
      assert.ok(result?.include?.includes("author"), "Result.include should include 'author'");
      assert.ok(
        result?.include?.includes("categories"),
        "Result.include should include 'categories'"
      );
      assert.ok(result?.include?.includes("tags"), "Result.include should include 'tags'");
      assert.ok(result?.include?.includes("comments"), "Result.include should include 'comments'");
      assert.ok(
        result?.relations?.author?.include?.includes("profile"),
        "Result.relations.author.include should include 'profile'"
      );
      assert.ok(
        result?.relations?.author?.include?.includes("settings"),
        "Result.relations.author.include should include 'settings'"
      );
      assert.ok(
        result?.relations?.comments?.include?.includes("author"),
        "Result.relations.comments.include should include 'author'"
      );
    });
  });
});
