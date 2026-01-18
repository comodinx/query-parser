import { Op } from "sequelize";
import { each, find, isString } from "lodash";
import { ParserResult, ParserInclude } from "../types";
import * as constants from "../constants";

//
// source code
//
export const sequelizeParser = (opts: Partial<ParserResult>): Partial<ParserResult> => {
  // Resolve include option
  resolveInclude(opts);

  // Resolve where option
  resolveWhere(opts);

  return opts;
};

//
// helpers
//

/**
 * Resolve include option
 */
const resolveInclude = (
  opts: Partial<ParserResult> | ParserResult["include"]
): Partial<ParserResult> | ParserResult["include"] | undefined => {
  if (!opts || !(opts as Partial<ParserResult>).include) {
    return opts;
  }

  const result = opts as Partial<ParserResult>;
  const relations = result.relations || {};

  // Associate model
  result.include = (result.include as ParserInclude[]).map((association: ParserInclude) => {
    if (!isString(association)) {
      return association;
    }

    // Resolve relations for this association
    return resolveInclude({
      // Associate model
      association,
      // Extra options for this include association
      ...(relations[association as string] || {})
    });
  }) as ParserInclude[];

  return result;
};

/**
 * Resolve where option
 */
const resolveWhere = (opts: Partial<ParserResult>): Partial<ParserResult> => {
  if (!opts || !opts.where) {
    return opts;
  }

  const filters = opts.where;

  opts.where = {};

  // Associate model
  each(filters, (condition, key) => {
    if (!isString(key)) {
      return;
    }
    resolveWhereCondition(opts, key, condition);
  });

  // Clean
  if (
    !opts.where ||
    (Object.getOwnPropertySymbols(opts.where).length === 0 && Object.keys(opts.where).length === 0)
  ) {
    delete opts.where;
  }

  return opts;
};

/**
 * Resolve where nested condition
 */
const resolveWhereCondition = (
  opts: Partial<ParserResult>,
  key: string,
  condition: unknown
): Partial<ParserResult> => {
  if (!key.includes(constants.propertiesConcatenator)) {
    opts.where = opts.where || {};

    switch (key) {
      case "or":
        opts.where[Op.or] = condition;
        break;

      case "and":
        opts.where[Op.and] = condition;
        break;

      default:
        opts.where[key] = condition;
        break;
    }
    opts.required = true;

    return opts;
  }

  const [association] = key.split(constants.propertiesConcatenator);
  const nextKey = key.replace(`${association}${constants.propertiesConcatenator}`, "");
  let relation: ParserInclude | undefined = find(opts.include, ["association", association]);

  if (!relation) {
    relation = { association };
    opts.include = (opts.include || []) as ParserInclude[];
    opts.include.push(relation);
  }

  return resolveWhereCondition(relation as Partial<ParserResult>, nextKey, condition);
};
