"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuery = void 0;
const lodash_1 = require("lodash");
const orm_1 = require("./orm");
const fields_1 = require("./fields");
const filters_1 = require("./filters");
const group_1 = require("./group");
const include_1 = require("./include");
const order_1 = require("./order");
const pagination_1 = require("./pagination");
//
// helpers
//
const mergeArrays = (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
};
//
// source code
//
const parseQuery = (query, options = {}) => {
    const pagination = (0, pagination_1.parsePagination)(query, options);
    const filters = (0, filters_1.parseFilters)(query, options);
    const fieldsOptions = (0, fields_1.parseFields)(query, options);
    const includeOptions = (0, include_1.parseInclude)(query, options);
    const orders = (0, order_1.parseOrder)(query, options);
    const groups = (0, group_1.parseGroup)(query, options);
    let opts = {};
    // resolve pagination
    if (pagination) {
        opts = { ...opts, ...pagination };
    }
    // resolve filters as where
    if (filters) {
        opts.where = filters;
    }
    // resolve fields
    if (fieldsOptions) {
        if (fieldsOptions.fields && fieldsOptions.fields.length) {
            opts.attributes = fieldsOptions.fields;
        }
        if (fieldsOptions.relations) {
            opts.relations = (0, lodash_1.mergeWith)(opts.relations || {}, fieldsOptions.relations, mergeArrays);
        }
        if (fieldsOptions.remotes && fieldsOptions.remotes.length) {
            opts.remotes = mergeArrays(opts.remotes || [], fieldsOptions.remotes);
        }
        if (fieldsOptions.extras && fieldsOptions.extras.length) {
            opts.extras = mergeArrays(opts.extras || [], fieldsOptions.extras);
        }
    }
    // resolve includes
    if (includeOptions) {
        if (includeOptions.include && includeOptions.include.length) {
            opts.include = includeOptions.include;
        }
        if (includeOptions.relations) {
            opts.relations = (0, lodash_1.mergeWith)(opts.relations || {}, includeOptions.relations, mergeArrays);
        }
        if (includeOptions.remotes && includeOptions.remotes.length) {
            opts.remotes = mergeArrays(opts.remotes || [], includeOptions.remotes);
        }
        if (includeOptions.extras && includeOptions.extras.length) {
            opts.extras = mergeArrays(opts.extras || [], includeOptions.extras);
        }
    }
    // resolve order
    if (orders) {
        opts.order = orders;
    }
    // resolve group
    if (groups && groups.length) {
        opts.group = groups;
    }
    // Add raw query options
    if (query.includeRaw || options.includeRaw) {
        opts.rawQueryOptions = query;
    }
    // Return raw options parsed
    if (query.raw || options.raw) {
        return opts;
    }
    // Parse options to sequelize ORM format
    return (0, orm_1.sequelizeParser)(opts);
};
exports.parseQuery = parseQuery;
