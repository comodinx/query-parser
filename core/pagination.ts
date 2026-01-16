import { isNumber, isObject } from "lodash";
import { ParserQuery, ParserOptions, ParserResult } from "./types";

//
// constants
//
const defaultPageSize = 0;

//
// source code
//
const getDefaultPageSize = (options: number | ParserOptions): number => {
  if (isNumber(options)) {
    return options as number;
  }

  return (
    (isObject(options) ? (options as ParserOptions)?.pageSize : defaultPageSize) || defaultPageSize
  );
};

export const parsePagination = (
  query: ParserQuery,
  options: ParserOptions = {}
): Partial<ParserResult> | undefined => {
  if (!query) {
    return;
  }

  const pageSize = Number(query.page_size || query.pageSize || getDefaultPageSize(options));
  const page = Number(query.page || 1) - 1;

  if (!pageSize) {
    return;
  }

  return {
    limit: pageSize,
    offset: page * pageSize
  };
};
