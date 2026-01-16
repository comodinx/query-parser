import { map } from "lodash";
import { col, fn } from "sequelize";
import { parseProperties } from "./properties";
import { ParserQuery, ParserOptions, ParserResult } from "./types";

//
// constants
//
const defaultConcatenator = "-";

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
    query.fieldsConcatenator || options.fieldsConcatenator || defaultConcatenator;
  const result = parseProperties(query, "fields", { ...options, skipFirstLevelProperty: true });

  if (result && result.fields) {
    const fields = map(result.fields, (field) => {
      const parts = field.split(concatenator);

      if (parts.length <= 1) {
        return field;
      }

      return [fn(parts[0], col(parts[1])), parts[2] || (parts[1] !== "*" ? parts[1] : parts[0])];
    });

    result.fields = fields && fields.length === 1 && fields[0] === "*" ? null : fields;
  }

  return result;
};
