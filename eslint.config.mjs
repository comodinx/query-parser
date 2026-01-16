import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import globals from "globals";

const files = ["**/*.{js,mjs,cjs,ts}"];
const ignores = ["dist/**/*", "bin/*"];

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...tseslint.configs.recommended.map((recommended) => ({
    ...recommended,
    files,
    ignores
  })),
  {
    ...pluginJs.configs.recommended,
    files,
    ignores
  },
  {
    ...eslintConfigPrettier,
    files,
    ignores
  },
  {
    ...eslintPluginPrettierRecommended,
    files,
    ignores
  },
  {
    ignores,
    files,
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-console": "error",
      "no-trailing-spaces": "error",
      "key-spacing": "error",
      "quote-props": ["error", "as-needed"],
      "no-multi-spaces": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "padding-line-between-statements": [
        "warn",
        { blankLine: "never", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"]
        }
      ],
      "prettier/prettier": [
        "error",
        {
          semi: true,
          trailingComma: "none",
          singleQuote: false,
          printWidth: 100,
          tabWidth: 2,
          bracketSpacing: true,
          endOfLine: "auto"
        }
      ]
    }
  }
];
