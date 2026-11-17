import { map } from "lodash";
import { col, fn } from "sequelize";
import { QueryParserError } from "./errors";
import { parseProperties } from "./properties";
import { ParserQuery, ParserOptions, ParserResult } from "./types";
import * as constants from "./constants";

//
// helpers
//
// ASCII check first: toUpperCase() maps look-alikes such as "ſum" to "SUM"
const isAllowedFunction = (name: string): boolean =>
  /^[A-Za-z]+$/.test(name) && constants.fieldFunctions.includes(name.toUpperCase());

//
// source code
//
export const parseFields = (
  query: ParserQuery,
  options: ParserOptions = {}
): Partial<ParserResult> | undefined => {
  if (!query || !query.fields) {
    return;
  }

  const concatenator =
    query.fieldsGroupConcatenator ||
    options.fieldsGroupConcatenator ||
    constants.fieldGroupConcatenator;
  const result = parseProperties(query, "fields", { ...options, skipFirstLevelProperty: true });

  if (result && result.fields) {
    const fields = map(result.fields, (field) => {
      const parts = field.split(concatenator);

      if (parts.length <= 1) {
        return field;
      }

      const [functionName, fieldName, alias, ...rest] = parts;

      // sequelize writes the function name into the SQL without escaping
      if (!isAllowedFunction(functionName)) {
        throw new QueryParserError(
          "INVALID_FIELD_FUNCTION",
          `Field function not allowed. Allowed functions: ${constants.fieldFunctions.join(", ")}`,
          functionName
        );
      }

      return [
        fn(functionName, col(fieldName), ...rest),
        alias ?? (fieldName !== constants.fieldAllIndicator ? fieldName : functionName)
      ];
    });

    result.fields =
      fields && fields.length === 1 && fields[0] === constants.fieldAllIndicator ? null : fields;
  }

  return result;
};
