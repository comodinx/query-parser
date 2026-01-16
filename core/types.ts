import { Fn } from "sequelize/types/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParserQuery = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParserOptions = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParserResult = {
  group?: string[];
  order?: [string, string | undefined][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  include?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: Record<string, any>;
  fields?: (string | Fn)[];
  limit?: number;
  offset?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type ParserPropertyType = "attributes" | "fields" | "include";
