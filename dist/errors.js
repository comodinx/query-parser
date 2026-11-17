"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParserError = void 0;
class QueryParserError extends Error {
    constructor(code, message, functionName) {
        super(message);
        this.name = "QueryParserError";
        this.code = code;
        this.functionName = functionName;
    }
}
exports.QueryParserError = QueryParserError;
