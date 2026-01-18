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
exports.sequelizeParser = void 0;
const sequelize_1 = require("sequelize");
const lodash_1 = require("lodash");
const constants = __importStar(require("../constants"));
//
// source code
//
const sequelizeParser = (opts) => {
    // Resolve include option
    resolveInclude(opts);
    // Resolve where option
    resolveWhere(opts);
    return opts;
};
exports.sequelizeParser = sequelizeParser;
//
// helpers
//
/**
 * Resolve include option
 */
const resolveInclude = (opts) => {
    if (!opts || !opts.include) {
        return opts;
    }
    const result = opts;
    const relations = result.relations || {};
    // Associate model
    result.include = result.include.map((association) => {
        if (!(0, lodash_1.isString)(association)) {
            return association;
        }
        // Resolve relations for this association
        return resolveInclude({
            // Associate model
            association,
            // Extra options for this include association
            ...(relations[association] || {})
        });
    });
    return result;
};
/**
 * Resolve where option
 */
const resolveWhere = (opts) => {
    if (!opts || !opts.where) {
        return opts;
    }
    const filters = opts.where;
    opts.where = {};
    // Associate model
    (0, lodash_1.each)(filters, (condition, key) => {
        if (!(0, lodash_1.isString)(key)) {
            return;
        }
        resolveWhereCondition(opts, key, condition);
    });
    // Clean
    if (!opts.where ||
        (Object.getOwnPropertySymbols(opts.where).length === 0 && Object.keys(opts.where).length === 0)) {
        delete opts.where;
    }
    return opts;
};
/**
 * Resolve where nested condition
 */
const resolveWhereCondition = (opts, key, condition) => {
    if (!key.includes(constants.propertiesConcatenator)) {
        opts.where = opts.where || {};
        switch (key) {
            case "or":
                opts.where[sequelize_1.Op.or] = condition;
                break;
            case "and":
                opts.where[sequelize_1.Op.and] = condition;
                break;
            default:
                opts.where[key] = condition;
                break;
        }
        opts.required = true;
        return opts;
    }
    const [association] = key.split(constants.propertiesConcatenator);
    const nextKey = key.replace(`${association}${constants.propertiesConcatenator}`, "");
    let relation = (0, lodash_1.find)(opts.include, ["association", association]);
    if (!relation) {
        relation = { association };
        opts.include = (opts.include || []);
        opts.include.push(relation);
    }
    return resolveWhereCondition(relation, nextKey, condition);
};
