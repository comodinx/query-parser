"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGroup = void 0;
//
// constants
//
const defaultSeparator = ",";
//
// source code
//
const parseGroup = (query, options = {}) => {
    if (!query || !query.group) {
        return;
    }
    const separator = query.groupSeparator || options.groupSeparator || defaultSeparator;
    return query.group.split(separator);
};
exports.parseGroup = parseGroup;
