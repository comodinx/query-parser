"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInclude = void 0;
const properties_1 = require("./properties");
//
// source code
//
const parseInclude = (query, options = {}) => {
    return (0, properties_1.parseProperties)(query, "include", options);
};
exports.parseInclude = parseInclude;
