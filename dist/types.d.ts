import { Fn } from "sequelize/types/utils";
export type ParserQuery = Record<string, any>;
export type ParserOptions = Record<string, any>;
export type ParserResult = {
    group?: string[];
    order?: [string, string | undefined][];
    include?: Record<string, any>;
    filters?: Record<string, any>;
    fields?: (string | Fn)[];
    limit?: number;
    offset?: number;
    [key: string]: any;
};
export type ParserPropertyType = "attributes" | "fields" | "include";
