import { ParserQuery, ParserOptions, ParserResult, ParserPropertyType } from "./types";
export declare const parseProperties: (query: ParserQuery, type: ParserPropertyType, options?: ParserOptions) => Partial<ParserResult> | undefined;
