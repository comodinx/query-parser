export type QueryParserErrorCode = "INVALID_FIELD_FUNCTION";
export declare class QueryParserError extends Error {
    readonly code: QueryParserErrorCode;
    /** The rejected function name. Kept out of the message so it is not echoed back to clients. */
    readonly functionName?: string;
    constructor(code: QueryParserErrorCode, message: string, functionName?: string);
}
