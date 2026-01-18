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
exports.parseFilters = void 0;
const operators = __importStar(require("@comodinx/query-filters/dist/operators"));
const query_filters_1 = require("@comodinx/query-filters");
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
const constants = __importStar(require("./constants"));
//
// constants
//
// Last parser instance
let lastParser = null;
// operator mappers
const mapOperator = {
    [operators.exactEqual]: sequelize_1.Op.eq, // Exact Equal
    [operators.equal]: sequelize_1.Op.eq,
    [operators.notEqual]: sequelize_1.Op.ne,
    [operators.greaterThan]: sequelize_1.Op.gt,
    [operators.greaterThanOrEqual]: sequelize_1.Op.gte,
    [operators.lessThan]: sequelize_1.Op.lt,
    [operators.lessThanOrEqual]: sequelize_1.Op.lte,
    [operators.like]: sequelize_1.Op.like,
    [operators.notLike]: sequelize_1.Op.notLike,
    [operators.includes]: sequelize_1.Op.in,
    [operators.notIncludes]: sequelize_1.Op.notIn,
    [operators.between]: sequelize_1.Op.between,
    [operators.notBetween]: sequelize_1.Op.notBetween,
    [operators.isNull]: sequelize_1.Op.is,
    [operators.isNotNull]: sequelize_1.Op.not
};
//
// helpers
//
const isNumberString = (value) => {
    if ((0, lodash_1.isNumber)(value)) {
        return true;
    }
    return !(0, lodash_1.isEmpty)(value) && !isNaN(Number(value));
};
const isBooleanString = (value) => {
    return !(0, lodash_1.isEmpty)(value) && constants.booleans.includes(String(value).toLowerCase());
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapValueParse = (value, operator) => {
    // exact equal
    if (operator.trim() === operators.exactEqual) {
        return (0, sequelize_1.literal)(value);
    }
    // is or is not
    if (operator.trim() === operators.isNull || operator.trim() === operators.isNotNull) {
        if (value === "null" || value === "undefined") {
            return null;
        }
        return value;
    }
    if ((0, lodash_1.isArray)(value)) {
        return (0, lodash_1.map)(value, (value) => mapValueParse(value, operator));
    }
    if (isNumberString(value)) {
        return Number(value);
    }
    if ((0, lodash_1.isBoolean)(value)) {
        return value;
    }
    if (isBooleanString(value)) {
        return constants.trues.includes(String(value).toLowerCase());
    }
    if ((0, lodash_1.isString)(value)) {
        return value.replace(constants.valueLikeParse, "%");
    }
    return value;
};
const mapValueFormat = (value, operator) => {
    if ((0, lodash_1.isArray)(value)) {
        return `[${value.map((value) => mapValueFormat(value, operator)).join(";")}]`;
    }
    if ((0, lodash_1.isObject)(value)) {
        return JSON.stringify(value);
    }
    if ((0, lodash_1.isString)(value)) {
        return value.replace(constants.valueLikeFormat, "*");
    }
    return `${value}`;
};
const createParser = (options = {}) => {
    return new query_filters_1.Parser((0, lodash_1.merge)({ mapValueFormat, mapValueParse, mapOperator, key: constants.keyPattern }, options));
};
//
// source code
//
const parseFilters = (query, options = {}) => {
    if (!query || !query.filters || (0, lodash_1.isEmpty)(query.filters)) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parser = (lastParser =
        options.parser ?? lastParser ?? createParser((options.parserOptions ?? options)));
    const parsed = parser.parse(query.filters);
    if (!parsed) {
        return;
    }
    const jsonKeys = options.jsonKeys ?? constants.filtersJsonKeys;
    return (0, lodash_1.reduce)(parsed, (carry, condition, key) => {
        const jsonKey = (0, lodash_1.find)(jsonKeys, (jsonKey) => (0, lodash_1.startsWith)(key, `${jsonKey}.`));
        if (jsonKey) {
            carry[sequelize_1.Op.and] = carry[sequelize_1.Op.and] || [];
            carry[sequelize_1.Op.and].push((0, sequelize_1.where)((0, sequelize_1.literal)(`${jsonKey}->"$${key.replace(jsonKey, "")}"`), condition));
        }
        else {
            carry[key] = condition;
        }
        return carry;
    }, {});
};
exports.parseFilters = parseFilters;
