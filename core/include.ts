import { ParserQuery, ParserOptions, ParserResult } from "./types";
import { parseProperties } from "./properties";

//
// source code
//
export const parseInclude = (
  query: ParserQuery,
  options: ParserOptions = {}
): Partial<ParserResult> | undefined => {
  return parseProperties(query, "include", options);
};
