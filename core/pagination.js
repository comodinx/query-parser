const { isNumber, isObject } = require("lodash");

//
// constants
//
const defaultPageSize = 0;

//
// helpers
//
const getDefaultPageSize = (options) => {
  if (isNumber(options)) {
    return options;
  }

  return (isObject(options) ? options.pageSize : defaultPageSize) || defaultPageSize;
};

//
// source code
//
module.exports = (query, options) => {
  if (!query) {
    return;
  }

  const pageSize = Number(query.page_size || query.pageSize || getDefaultPageSize(options));
  const page = Number(query.page || 1) - 1;

  if (!pageSize) {
    return;
  }

  return {
    limit: pageSize,
    offset: page * pageSize
  };
};
