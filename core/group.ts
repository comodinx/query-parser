import { ParserQuery, ParserOptions, ParserResult } from "./types";
import * as constants from "./constants";

//
// source code
//
export const parseGroup = (
  query: ParserQuery,
  options: ParserOptions = {}
): ParserResult["group"] | undefined => {
  if (!query || !query.group) {
    return;
  }

  const separator = query.groupSeparator ?? options.groupSeparator ?? constants.groupSeparator;

  return query.group.split(separator);
};
