import { ParserQuery, ParserOptions, ParserResult } from "./types";

//
// constants
//
const defaultSeparator = ",";

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

  const separator = query.groupSeparator || options.groupSeparator || defaultSeparator;

  return query.group.split(separator);
};
