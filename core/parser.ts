import { mergeWith } from "lodash";
import { sequelizeParser } from "./orm";
import { parseFields } from "./fields";
import { parseFilters } from "./filters";
import { parseGroup } from "./group";
import { parseInclude } from "./include";
import { parseOrder } from "./order";
import { parsePagination } from "./pagination";
import { ParserOptions, ParserQuery, ParserResult } from "./types";

//
// helpers
//
const mergeArrays = (objValue: unknown, srcValue: unknown): unknown => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

//
// source code
//
export const parseQuery = (
  query: ParserQuery,
  options: ParserOptions = {}
): Partial<ParserResult> => {
  const pagination = parsePagination(query, options);
  const filters = parseFilters(query, options);
  const fieldsOptions = parseFields(query, options);
  const includeOptions = parseInclude(query, options);
  const orders = parseOrder(query, options);
  const groups = parseGroup(query, options);
  let opts: Partial<ParserResult> = {};

  // resolve pagination
  if (pagination) {
    opts = { ...opts, ...pagination };
  }

  // resolve filters as where
  if (filters) {
    opts.where = filters;
  }

  // resolve fields
  if (fieldsOptions) {
    if (fieldsOptions.fields && fieldsOptions.fields.length) {
      opts.attributes = fieldsOptions.fields;
    }
    if (fieldsOptions.relations) {
      opts.relations = mergeWith(opts.relations || {}, fieldsOptions.relations, mergeArrays);
    }
    if (fieldsOptions.remotes && fieldsOptions.remotes.length) {
      opts.remotes = mergeArrays(opts.remotes || [], fieldsOptions.remotes);
    }
    if (fieldsOptions.extras && fieldsOptions.extras.length) {
      opts.extras = mergeArrays(opts.extras || [], fieldsOptions.extras);
    }
  }

  // resolve includes
  if (includeOptions) {
    if (includeOptions.include && includeOptions.include.length) {
      opts.include = includeOptions.include;
    }
    if (includeOptions.relations) {
      opts.relations = mergeWith(opts.relations || {}, includeOptions.relations, mergeArrays);
    }
    if (includeOptions.remotes && includeOptions.remotes.length) {
      opts.remotes = mergeArrays(opts.remotes || [], includeOptions.remotes);
    }
    if (includeOptions.extras && includeOptions.extras.length) {
      opts.extras = mergeArrays(opts.extras || [], includeOptions.extras);
    }
  }

  // resolve order
  if (orders) {
    opts.order = orders;
  }

  // resolve group
  if (groups && groups.length) {
    opts.group = groups;
  }

  // Add raw query options
  if (query.includeRaw || options.includeRaw) {
    opts.rawQueryOptions = query;
  }

  // Return raw options parsed
  if (query.raw || options.raw) {
    return opts;
  }

  // Parse options to sequelize ORM format
  return sequelizeParser(opts);
};
