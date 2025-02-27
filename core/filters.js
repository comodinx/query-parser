const { Mappers, Parser } = require("@comodinx/query-filters");
const {
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
} = require("lodash");
const { literal, Op, where } = require("sequelize");

//
// constants
//
const trues = ["true", "1", "on"];
const falses = ["false", "0", "off"];
const booleans = [...trues, ...falses];

// operator mappers
const mapOperator = {
  ee: Op.eq, // Exact Equal
  eq: Op.eq,
  ne: Op.ne,
  gt: Op.gt,
  ge: Op.gte,
  lt: Op.lt,
  le: Op.lte,
  li: Op.like,
  nl: Op.notLike,
  in: Op.in,
  ni: Op.notIn,
  be: Op.between,
  nb: Op.notBetween,
  is: Op.is,
  no: Op.not
};
// filter separator
const defaultSeparator = ",";

const key = "[A-Za-z0-9_.]+";

const valueLikeParse = /\*/g;
// eslint-disable-next-line no-useless-escape
const valueLikeFormat = /\%/g;

// Json keys
const defaultJsonKeys = ["metadata"];

// Extends mappers on @comodinx/query-filters
Mappers.Sequelize = mapOperator;

//
// helpers
//
const isNumberString = (value) => {
  if (isNumber(value)) {
    return true;
  }

  return !isEmpty(value) && !isNaN(Number(value));
};

const isBooleanString = (value) => {
  return !isEmpty(value) && booleans.includes(String(value).toLowerCase());
};

const mapValueParse = (value, operator) => {
  // exact equal
  if (operator.trim() === "ee") {
    return literal(value);
  }

  // is or is not
  if (operator.trim() === "is" || operator.trim() === "no") {
    if (value === "null" || value === "undefined") {
      return null;
    }

    return value;
  }

  if (isArray(value)) {
    return map(value, (value) => mapValueParse(value, operator));
  }

  if (isNumberString(value)) {
    return Number(value);
  }
  if (isBoolean(value)) {
    return value;
  }
  if (isBooleanString(value)) {
    return trues.includes(String(value).toLowerCase());
  }
  if (isString(value)) {
    return value.replace(valueLikeParse, "%");
  }

  return value;
};

const mapValueFormat = (value, operator) => {
  if (isArray(value)) {
    return `[${value.map((value) => mapValueFormat(value, operator)).join(";")}]`;
  }
  if (isObject(value)) {
    return JSON.stringify(value);
  }
  if (isString(value)) {
    return value.replace(valueLikeFormat, "*");
  }

  return value;
};

const createParser = (options = {}) => {
  return new Parser(
    merge(
      {},
      {
        separator: defaultSeparator,
        mapValueFormat,
        mapValueParse,
        mapOperator,
        key
      },
      options
    )
  );
};

//
// source code
//
const filters = (query, options = {}) => {
  // Save last parser instance.
  const parser = (filters.lastParser = createParser(
    merge(
      {},
      {
        separator: (query && query.filtersSeparator) || defaultSeparator
      },
      options || {}
    )
  ));

  if (!query || !query.filters || isEmpty(query.filters)) {
    return;
  }

  const parsed = parser.parse(query.filters);

  if (!parsed) {
    return;
  }

  const jsonKeys = options.jsonKeys || defaultJsonKeys;

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

filters.createParser = createParser;

module.exports = filters;
