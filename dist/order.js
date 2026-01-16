"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrder = void 0;
const lodash_1 = require("lodash");
//
// constants
//
const directions = ["DESC", "ASC"];
const defaultMapping = {
    date: "created_at"
};
const defaultSeparator = ",";
const defaultGroupSeparator = "-";
//
// source code
//
const parseOrder = (query, options = {}) => {
    if (!query || !query.order) {
        return;
    }
    const mapping = (0, lodash_1.merge)({}, defaultMapping, options.orderMapping || {});
    const separator = query.orderSeparator || options.orderSeparator || defaultSeparator;
    const groupSeparator = query.orderGroupSeparator || options.orderGroupSeparator || defaultGroupSeparator;
    return query.order.split(separator).map((condition) => {
        const [key, direction] = condition.split(groupSeparator);
        const order = [mapping[key] || key];
        if (direction && directions.includes(direction.toUpperCase())) {
            order.push(direction.toUpperCase());
        }
        return order;
    });
};
exports.parseOrder = parseOrder;
