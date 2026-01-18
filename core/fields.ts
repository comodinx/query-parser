import { map } from "lodash";
import { col, fn } from "sequelize";
import { parseProperties } from "./properties";
import { ParserQuery, ParserOptions, ParserResult } from "./types";
import * as constants from "./constants";

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
