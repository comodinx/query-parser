import { Parser, ParserOptions as ParserFiltersOptions } from "@comodinx/query-filters";
import { FindOptions, OrderItem, IncludeOptions } from "sequelize";
import { Fn } from "sequelize/types/utils";
export type ParserField = string | Fn;
export type ParserOrder = OrderItem;
export type ParserInclude = IncludeOptions;
export type ParserOptions = {
    /** The separator for the fields (Ex. "id,created_at"). Default "," */
    fieldsSeparator?: string;
    /** The concatenator for the fields group (Ex. "COUNT-id,created_at,metadata.platform"). Default "-" */
    fieldsGroupConcatenator?: string;
    /** The separator for the include (Ex. "status,products"). Default "," */
    includeSeparator?: string;
    /** The concatenator for the include (Ex. "product.status,product.variants"). Default "." */
    includeConcatenator?: string;
    /** The separator for the group (Ex. "id,created_at"). Default "," */
    groupSeparator?: string;
    /** The separator for the order (Ex. "id,created_at"). Default "," */
    orderSeparator?: string;
    /** The concatenator for the order (Ex. "id-DESC,created_at-ASC"). Default "-" */
    orderConcatenator?: string;
    /** @deprecated (retrocompatibility) Use `orderConcatenator` instead. */
    orderGroupSeparator?: string;
    /** The mapping for the order field name for shortcuts (Ex. { "date": "created_at" }). Default null */
    orderMapping?: Record<string, string>;
    /** The page size. Default null */
    pageSize?: string | number;
    /** The personalized parser for the query. Default null */
    parser?: Parser;
    /** The filters parser options. Default null */
    parserOptions?: ParserFiltersOptions;
    /** The JSON keys to parse (Ex. ["metadata"]). Default null */
    jsonKeys?: string[];
    /** The include raw query on the result. Default null */
    includeRaw?: boolean;
    /** The raw result format. Default null */
    raw?: boolean;
    /** Indicate if skip the first level property. Default false. INTERNAL USE ONLY */
    skipFirstLevelProperty?: boolean;
};
export type ParserQuery = ParserOptions & {
    /** The filters query (Ex. "statusId eq 1"). Default null */
    filters?: string;
    /** The order query (Ex. "id-DESC"). Default null */
    order?: string;
    /** The group query (Ex. "id,created_at"). Default null */
    group?: string;
    /** The fields query (Ex. "id,created_at"). Default null */
    fields?: ParserField | ParserField[];
    /** The include query (Ex. "status,products"). Default null */
    include?: string;
    /** The page size query (Ex. "10"). Default null */
    pageSize?: number | string;
    /** The page query (Ex. "1"). Default null */
    page?: number | string;
};
export type ParserResult = FindOptions & {
    [key: string]: any;
};
export type ParserPropertyType = "attributes" | "fields" | "include";
