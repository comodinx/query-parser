"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleans = exports.falses = exports.trues = exports.propertiesMapTypes = exports.propertiesExtraPrefix = exports.propertiesRemotePrefix = exports.propertiesConcatenator = exports.propertiesSeparator = exports.valueLikeParse = exports.valueLikeFormat = exports.keyPattern = exports.filtersJsonKeys = exports.groupSeparator = exports.orderConcatenator = exports.orderSeparator = exports.orderMappingFieldNames = exports.orderDirections = exports.fieldAllIndicator = exports.fieldGroupConcatenator = exports.fieldConcatenator = exports.fieldSeparator = exports.paginationPageSize = void 0;
//
// pagination
//
exports.paginationPageSize = 0;
//
// fields
//
exports.fieldSeparator = ",";
exports.fieldConcatenator = ".";
exports.fieldGroupConcatenator = "-";
exports.fieldAllIndicator = "*";
//
// orders
//
exports.orderDirections = ["DESC", "ASC"];
exports.orderMappingFieldNames = {
    date: "created_at"
};
exports.orderSeparator = ",";
exports.orderConcatenator = "-";
//
// groups
//
exports.groupSeparator = ",";
//
// filters
//
exports.filtersJsonKeys = ["metadata"];
exports.keyPattern = "[A-Za-z0-9_.]+";
// eslint-disable-next-line no-useless-escape
exports.valueLikeFormat = /\%/g;
exports.valueLikeParse = /\*/g;
//
// properties
//
exports.propertiesSeparator = ",";
exports.propertiesConcatenator = ".";
exports.propertiesRemotePrefix = "r-";
exports.propertiesExtraPrefix = "e-";
exports.propertiesMapTypes = {
    attributes: "attributes",
    fields: "attributes",
    include: "include"
};
//
// helpers
//
exports.trues = ["true", "on"];
exports.falses = ["false", "off"];
exports.booleans = [...exports.trues, ...exports.falses];
