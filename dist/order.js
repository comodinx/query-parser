"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrder = void 0;
const lodash_1 = require("lodash");
const constants = __importStar(require("./constants"));
//
// source code
//
const parseOrder = (query, options = {}) => {
    if (!query || !query.order) {
        return;
    }
    const mapping = (0, lodash_1.merge)({}, constants.orderMappingFieldNames, options.orderMapping || {});
    const separator = query.orderSeparator || options.orderSeparator || constants.orderSeparator;
    const concatenator = 
    // @deprecated (retrocompatibility)
    query.orderGroupSeparator ||
        // @deprecated (retrocompatibility)
        options.orderGroupSeparator ||
        query.orderConcatenator ||
        options.orderConcatenator ||
        constants.orderConcatenator;
    return query.order.split(separator).map((condition) => {
        const [key, direction] = condition.split(concatenator);
        const order = [mapping[key] || key];
        if (direction && constants.orderDirections.includes(direction.toUpperCase())) {
            order.push(direction.toUpperCase());
        }
        return order;
    });
};
exports.parseOrder = parseOrder;
