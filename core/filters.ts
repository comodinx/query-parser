import * as operators from "@comodinx/query-filters/dist/operators";
import { Parser, ParserOptions as ParserFiltersOptions } from "@comodinx/query-filters";
import {
  find,
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isObject,
  isString,
  map,
  merge,
  reduce,
  startsWith
} from "lodash";
import { literal, Op, where } from "sequelize";
import { ParserOptions, ParserQuery, ParserResult } from "./types";
import * as constants from "./constants";

//
// constants
//
// Last parser instance
let lastParser: Parser | null = null;

// operator mappers
const mapOperator: Record<string, symbol> = {
  [operators.exactEqual]: Op.eq, // Exact Equal
  [operators.equal]: Op.eq,
  [operators.notEqual]: Op.ne,
  [operators.greaterThan]: Op.gt,
  [operators.greaterThanOrEqual]: Op.gte,
  [operators.lessThan]: Op.lt,
  [operators.lessThanOrEqual]: Op.lte,
  [operators.like]: Op.like,
  [operators.notLike]: Op.notLike,
  [operators.includes]: Op.in,
  [operators.notIncludes]: Op.notIn,
  [operators.between]: Op.between,
  [operators.notBetween]: Op.notBetween,
  [operators.isNull]: Op.is,
  [operators.isNotNull]: Op.not
};

//
// helpers
//
const isNumberString = (value: unknown): boolean => {
  if (isNumber(value)) {
    return true;
  }

  return !isEmpty(value) && !isNaN(Number(value));
};

const isBooleanString = (value: unknown): boolean => {
  return !isEmpty(value) && constants.booleans.includes(String(value).toLowerCase());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapValueParse = <T = any>(value: unknown, operator: string): T | null => {
  // exact equal
  if (operator.trim() === operators.exactEqual) {
    return literal(value as never) as T;
  }

  // is or is not
  if (operator.trim() === operators.isNull || operator.trim() === operators.isNotNull) {
    if (value === "null" || value === "undefined") {
      return null;
    }

    return value as T;
  }

  if (isArray(value)) {
    return map(value, (value) => mapValueParse(value, operator)) as T;
  }

  if (isNumberString(value)) {
    return Number(value) as T;
  }
  if (isBoolean(value)) {
    return value as T;
  }
  if (isBooleanString(value)) {
    return constants.trues.includes(String(value).toLowerCase()) as T;
  }
  if (isString(value)) {
    return (value as string).replace(constants.valueLikeParse, "%") as T;
  }

  return value as T;
};

const mapValueFormat = (value: unknown, operator: string): string => {
  if (isArray(value)) {
    return `[${(value as unknown[]).map((value: unknown) => mapValueFormat(value, operator)).join(";")}]`;
  }
  if (isObject(value)) {
    return JSON.stringify(value);
  }
  if (isString(value)) {
    return (value as string).replace(constants.valueLikeFormat, "*");
  }

  return `${value}`;
};

const createParser = (options: ParserFiltersOptions = {}): Parser => {
  return new Parser(
    merge({ mapValueFormat, mapValueParse, mapOperator, key: constants.keyPattern }, options)
  );
};

//
// source code
//
export const parseFilters = (
  query: ParserQuery,
  options: ParserOptions = {}
): ParserResult["filters"] | undefined => {
  if (!query || !query.filters || isEmpty(query.filters)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parser = (lastParser =
    options.parser ?? lastParser ?? createParser((options.parserOptions ?? options) as never));
  const parsed = parser.parse(query.filters);

  if (!parsed) {
    return;
  }

  const jsonKeys = options.jsonKeys ?? constants.filtersJsonKeys;

  return reduce(
    parsed,
    (carry, condition, key) => {
      const jsonKey = find(jsonKeys, (jsonKey) => startsWith(key, `${jsonKey}.`));

      if (jsonKey) {
        carry[Op.and] = carry[Op.and] || [];
        carry[Op.and].push(where(literal(`${jsonKey}->"$${key.replace(jsonKey, "")}"`), condition));
      } else {
        carry[key] = condition;
      }

      return carry;
    },
    {}
  );
};
