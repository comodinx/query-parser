'use strict';

const { mergeWith } = require("lodash");
const { sequelizeParser } = require("./orm");
const buildFields = require("./fields");
const buildFilters = require("./filters");
const buildGroup = require("./group");
const buildInclude = require("./include");
const buildOrder = require("./order");
const buildPagination = require("./pagination");

//
// helpers
//

/**
 * Merge array values
 */
const mergeArrays = (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

//
// source code
//
module.exports =(query, options = {}) => {
  const pagination = buildPagination(query, options);
  const filters = buildFilters(query, options);
  const fieldsOptions = buildFields(query, options);
  const includeOptions = buildInclude(query, options);
  const orders = buildOrder(query, options);
  const groups = buildGroup(query);
  const opts = {};

  // resolve pagination
  if (pagination) {
    opts.limit = pagination.limit;
    opts.offset = pagination.offset;
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
      opts.relations = mergeWith(opts.relations || {}, fieldsOptions.relations, mergeArrays);
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
      opts.relations = mergeWith(opts.relations || {}, includeOptions.relations, mergeArrays);
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

  // Parse options to sequelize ORM format
  return sequelizeParser(opts);
};
