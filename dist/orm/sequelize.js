"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelizeParser = void 0;
const sequelize_1 = require("sequelize");
const lodash_1 = require("lodash");
//
// constants
//
const fieldSeparator = ".";
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
    const relations = opts.relations || {};
    // Associate model
    opts.include = opts.include.map((association) => {
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
    return opts;
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
    if (!key.includes(fieldSeparator)) {
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
    const [association] = key.split(fieldSeparator);
    const nextKey = key.replace(`${association}.`, "");
    let relation = (0, lodash_1.find)(opts.include, ["association", association]);
    if (!relation) {
        relation = { association };
        opts.include = opts.include || [];
        opts.include.push(relation);
    }
    return resolveWhereCondition(relation, nextKey, condition);
};
