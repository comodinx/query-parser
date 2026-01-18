import { ParserQuery, ParserOptions, ParserResult } from "./types";
import * as constants from "./constants";

//
// source code
//
export const parsePagination = (
  query: ParserQuery,
  options: ParserOptions = {}
): Partial<ParserResult> | undefined => {
  if (!query) {
    return;
  }

  const pageSize = Number(query.pageSize ?? options.pageSize ?? constants.paginationPageSize);

  if (!pageSize) {
    return;
  }

  const page = Number(query.page || 1) - 1;

  return {
    limit: pageSize,
    offset: page * pageSize
  };
};
