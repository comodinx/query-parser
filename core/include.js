const properties = require("./properties");

//
// source code
//
module.exports = (query, options = {}) => {
  return properties(query, "include", options);
};
